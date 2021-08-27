export class ContractCreate {

    public static toRecord(sourceContracts: string[], payer: string): Record<any, any> {
        return {
            source_contracts: sourceContracts,
            payer: payer,
        };
    }
}

export class Execute {
    public static depositToRecord(): Record<string, any> {
        return {
            deposit: {}
        }
    }

}

export class Query {

    public static contractInfoToRecord(): Record<string, any> {
        return {
            contract_info: {}
        }
    }
}

export class ContractInfo {
    contract: string;
    source_contracts: string[];
    payer: string;
    amount: string;

    constructor(contract: string, sourceContracts: string[], payer: string, amount: string) {
        this.contract = contract;
        this.source_contracts = sourceContracts;
        this.payer = payer;
        this.amount = amount;
    }

}