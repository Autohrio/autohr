const { Billing, Workspace } = require('../../models/models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a new billing plan
exports.createBillingPlan = async (req, res) => {
  try {
    const { workspaceId, plan, stripeCustomerId } = req.body;
    const billing = new Billing({
      plan,
      stripeCustomerId
    });
    await billing.save();

    // Add billing to workspace if workspaceId is provided
    if (workspaceId) {
      const workspace = await Workspace.findById(workspaceId);
      if (workspace) {
        workspace.billing = billing._id;
        await workspace.save();
      }
    }

    res.status(201).json(billing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all billing plans
exports.getAllBillingPlans = async (req, res) => {
  try {
    const billingPlans = await Billing.find();
    res.json(billingPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single billing plan by ID
exports.getBillingPlanById = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);
    if (!billing) return res.status(404).json({ message: 'Billing plan not found' });
    res.json(billing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a billing plan
exports.updateBillingPlan = async (req, res) => {
  try {
    const { plan, stripeCustomerId } = req.body;
    const billing = await Billing.findByIdAndUpdate(
      req.params.id,
      { plan, stripeCustomerId },
      { new: true, runValidators: true }
    );
    if (!billing) return res.status(404).json({ message: 'Billing plan not found' });
    res.json(billing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a billing plan
exports.deleteBillingPlan = async (req, res) => {
  try {
    const billing = await Billing.findByIdAndDelete(req.params.id);
    if (!billing) return res.status(404).json({ message: 'Billing plan not found' });

    // Remove billing from workspace
    await Workspace.updateOne(
      { billing: billing._id },
      { $unset: { billing: 1 } }
    );

    res.json({ message: 'Billing plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get billing plan by workspace
exports.getBillingPlanByWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId).populate('billing');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    if (!workspace.billing) return res.status(404).json({ message: 'Billing plan not found for this workspace' });
    res.json(workspace.billing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change billing plan
exports.changeBillingPlan = async (req, res) => {
  try {
    const { workspaceId, newPlan } = req.body;
    const workspace = await Workspace.findById(workspaceId).populate('billing');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    if (!workspace.billing) return res.status(404).json({ message: 'Billing plan not found for this workspace' });

    // Update the plan in Stripe
    await stripe.subscriptions.update(workspace.billing.stripeSubscriptionId, {
      items: [{ plan: newPlan }]
    });

    // Update the plan in our database
    workspace.billing.plan = newPlan;
    await workspace.billing.save();

    res.json(workspace.billing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get billing invoice
exports.getBillingInvoice = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId).populate('billing');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    if (!workspace.billing) return res.status(404).json({ message: 'Billing plan not found for this workspace' });

    const invoice = await stripe.invoices.retrieve(workspace.billing.stripeLatestInvoiceId);
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update payment method
exports.updatePaymentMethod = async (req, res) => {
  try {
    const { workspaceId, paymentMethodId } = req.body;
    const workspace = await Workspace.findById(workspaceId).populate('billing');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    if (!workspace.billing) return res.status(404).json({ message: 'Billing plan not found for this workspace' });

    // Update the payment method in Stripe
    await stripe.customers.update(workspace.billing.stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethodId }
    });

    res.json({ message: 'Payment method updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get billing usage
exports.getBillingUsage = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId).populate('billing');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    if (!workspace.billing) return res.status(404).json({ message: 'Billing plan not found for this workspace' });

    // This is a mock implementation. In a real-world scenario, you would calculate actual usage.
    const mockUsage = {
      planName: workspace.billing.plan,
      currentPeriodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      currentPeriodEnd: new Date(),
      totalUsage: Math.floor(Math.random() * 1000),
      limitUsage: 1000,
      percentageUsed: Math.floor(Math.random() * 100)
    };

    res.json(mockUsage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};