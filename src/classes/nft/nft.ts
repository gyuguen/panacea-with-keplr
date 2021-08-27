import {Coin} from "@cosmjs/stargate";

export class ContractCreate {

    public static toRecord(name: string, symbol: string, minter: string): Record<any, any> {
        return {
            name: name,
            symbol: symbol,
            minter: minter,
        };
    }
}

export class Execute {

    public static mintToRecord(owner: string, name: string, image: string, price: Coin): Record<string, any> {
        return {
            mint: {
                owner: owner,
                name: name,
                image: image,
                price: price,
            }
        }
    }

    public static transferNftToRecord(tokenId: string, recipient: string) {
        return {
            transfer_nft: {
                token_id: tokenId,
                recipient: recipient,
            }
        }
    }

    public static sendNftToRecord(tokenId: string, targetContract: string) {
        return {
            send_nft: {
                token_id: tokenId,
                contract: targetContract,
            }
        }
    }
}

export class Query {

    public static contractInfoToRecord(): Record<string, any> {
        return {
            contract_info: {}
        };
    }

    public static allTokensToRecord(startAfter?: string, limit?: number): Record<string, any> {
        return {
            all_tokens: {
                start_after: startAfter,
                limit: limit,
            }
        }
    }

    public static allNftInfoToRecord(tokenId: string, includeExpired?: boolean): Record<string, any> {
        return {
            all_nft_info: {
                token_id: tokenId,
                include_expired: includeExpired,
            }
        }
    }
    
    public static tokens(owner: string, startAfter?: string, limit?: number): Record<string, any> {
        return {
            tokens: {
                owner: owner,
                start_after: startAfter,
                limit: limit,
            }
        }
    }
}

export class ContractInfo {
    contract: string;
    name: string;
    symbol: string;

    constructor(contract: string, name: string, symbol: string) {
        this.contract = contract;
        this.name = name;
        this.symbol = symbol;

    }

}

export class Tokens {
    tokens: string[]

    constructor(tokens: string[]) {
        this.tokens = tokens;
    }
}

export class Owner {
    owner: string;
    approvals: any[];

    constructor(owner: string, approvals: any[]) {
        this.owner = owner;
        this.approvals = approvals;
    }
}

export class NftInfo {
    name: string;
    description: string;
    image: string;
    price: Coin;

    constructor(name: string, description: string, image: string) {
        this.name = name;
        this.description = description;
        this.image = image;
    }

}

export class AllNftInfo {
    tokenId: string;
    access: Owner;
    info: NftInfo;

    constructor(tokenId: string, access: Owner, info: NftInfo) {
        this.tokenId = tokenId;
        this.access = access;
        this.info = info;
    }

}