// Metadata asset
export interface StorageAsset {
    name: string;
    kind: string;
    timestamp: number;
    description: string;
    image: string;
    sources: string[];
    owner: string;
}

// Storage block
export interface StorageBlock {
    content: StorageAsset | string;
    kind: string;
    signature: string;
    digest: string;
    timestamp: number;
    issuer: string;
}

// Ancon Node block
export interface VerifiableStorageBlock extends StorageBlock {
    commitHash: string;
    kind: string;
    contentHash: string;
    height: number;
    key: string;
    rootKey: string;
    lastBlockHash: string;
    network: string;

}
