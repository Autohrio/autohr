import React from 'react';

const Integrations: React.FC = () => {
  return (
    <div className="container mx-auto p-4 px-20">
      <h1 className="text-2xl font-bold mb-4">Integrations</h1>
      <p className="mb-8">To integrate our components into your project, follow these steps:</p>
      
      <h2 className="text-xl font-semibold mb-2">1. Install DaisyUI</h2>
      <div className="mockup-code mb-4">
        <pre data-prefix="$"><code>npm i @autohr/autohr-js</code></pre>
      </div>
      
      <h2 className="text-xl font-semibold mb-2">2. Configure Tailwind CSS</h2>
      <p className="mb-2">Add DaisyUI to your tailwind.config.js:</p>
      <div className="mockup-code mb-4">
        <pre data-prefix=""><code>
{`
  module.exports = {
      //...
      plugins: [require("daisyui")],
  }
`}
        </code></pre>
      </div>
      
      <h2 className="text-xl font-semibold mb-2">3. Import and Use Components</h2>
      <p className="mb-2">You can now import and use our components in your React application:</p>
      <div className="mockup-code">
        <pre data-prefix="" className='px-4'><code>
{`
import React from 'react';
import { Button } from './components/ui/button';

const MyComponent: React.FC = () => {
  return (
    <Button>Click me!</Button>
  );
};

export default MyComponent;`}
        </code></pre>
      </div>

    </div>
  );
};

export default Integrations;