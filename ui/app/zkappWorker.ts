import { Field, Mina, PublicKey, SmartContract, State, fetchAccount, method, state } from 'o1js';
import * as Comlink from "comlink";

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

const states = {
  AddInstance: null as null | typeof Add,
  zkappInstance: null as null | Add,
  transaction: null as null | Transaction,
};

export class Add extends SmartContract {
    @state(Field) num = State<Field>();
  
    init() {
      super.init();
      this.num.set(Field(1));
    }
  
    @method async update() {
      const currentState = this.num.getAndRequireEquals();
      const newState = currentState.add(2);
      this.num.set(newState);
    }
  }
  


export const api = {
  async setActiveInstanceToDevnet() {
    const Network = Mina.Network('https://api.minascan.io/node/devnet/v1/graphql');
    console.log('Devnet network instance configured');
    Mina.setActiveInstance(Network);
  },
  async loadContract() {
    states.AddInstance = Add;
  },
  async compileContract() {
    await states.AddInstance!.compile();
  },
  async fetchAccount(publicKey58: any) {
    const publicKey = PublicKey.fromBase58(publicKey58);
    return fetchAccount({ publicKey });
  },
  async initZkappInstance(publicKey58: string) {
    const publicKey = PublicKey.fromBase58(publicKey58);
    states.zkappInstance = new states.AddInstance!(publicKey);
  },
  async getNum() {
    const currentNum = await states.zkappInstance!.num.get();
    return JSON.stringify(currentNum.toJSON());
  },
  async createUpdateTransaction() {
    states.transaction = await Mina.transaction(async () => {
      await states.zkappInstance!.update();
    });
  },
  async proveUpdateTransaction() {
    await states.transaction!.prove();
  },
  async getTransactionJSON() {
    return states.transaction!.toJSON();
  },
};

// Expose the API to be used by the main thread
Comlink.expose(api);