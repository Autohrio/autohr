export interface ICompanyFeedback {
  _id: string;
  from_employee: string;
  feedback: string;
  created_at: string;
}


export interface AgentMemory {
  memory: Record<string, any>;
  prompt_template: string;
}

export interface AgentLLMConfig {
  model: string;
  model_endpoint_type: "openai" | string;
  model_endpoint: string;
  model_wrapper: string;
  context_window: number;
}

export interface AgentEmbeddingConfig {
  embedding_endpoint_type: string;
  embedding_endpoint: string;
  embedding_model: string;
  embedding_dim: number;
  embedding_chunk_size: number;
  azure_endpoint: string;
  azure_version: string;
  azure_deployment: string;
}

export interface Agent {
  description: string;
  metadata_: Record<string, any>;
  user_id: string;
  id: string[];
  name: string;
  created_at: string;
  message_ids: string[];
  memory: AgentMemory;
  tools: string[];
  system: string;
  agent_type: "memgpt_agent" | string;
  llm_config: AgentLLMConfig;
  embedding_config: AgentEmbeddingConfig;
}
