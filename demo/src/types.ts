export interface NodeData {
  key: string;
  label: string;
  tag: string;
  URL: string;
  cluster: string;
  x: number;
  y: number;
  infos:string;
}

export interface Cluster {
  key: string;
  color: string;
  clusterLabel: string;
  app_info: AppInfo;
}

export interface User {
  key: string;
  color: string;
  userLabel: string
}

export interface Tag {
  key: string;
  image: string;
}

export interface Dataset {
  nodes: NodeData[];
  edges: [string, string][];
  clusters: Cluster[];
  users: User[];
  tags: Tag[];
}

export interface FiltersState {
  clusters: Record<string, boolean>;
  tags: Record<string, boolean>;
  users: Record<string, boolean>;
}

export interface AppInfo {
  Identifiant: string;
  ccx: string;
  'Structure responsable': string;
  Nom: string;
  'Statut Déco': string;
  'Contact Référent': string;
  'Responsable Exploitation': string;
  'Appartenance': string;
}