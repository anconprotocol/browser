// Metadata asset - Store locally
export interface StorageAsset {
    name: string;
    kind: string;
    timestamp: number;
    description: string;
    image: string;
    sources: string[];
    owner: string;
}

// Storage block - Web3 + Topic
export interface StorageBlock {
    content: StorageAsset | string;
    kind: string;
    signature: string; // Either Waku+Web3 EIP712 or eth_signMessage
    digest: string;
    timestamp: number;
    issuer: string;
    ref: string;
}

export interface IPFSBlock {
    cid: string;
    kind: string;
    ref: string;
}

export interface AnconBlock {
    cid: string;
    topic: string;
    kind: string;
    ref: string;
}

export interface ERC721Block {
    name: string;
    kind: string;
    description: string;
    metadata: string;
    tokenAddress: string;
    tokenId: string;
    chainId: string;
    minterAddress: string;
    ownerAddress: string;
    ref: string;
}
// Ancon Node block - Public
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

// History { id: topic#,  kind: 'TopicMessage', meta: payload }

// TopicSubscription { topic, peerCount,  }

// DataFeedSubscriptions (aka GET + Indexing)
// { id, kind: 'DataFeed', ....}

// DataKeeperTasks (aka interactive agents)
// { id, kind: 'DataKeeper', ...}

// TokenAccounting (queries royalty reports)
// { id, kind: 'TokenAccounting', ... }