/**
 * The Flex interface.
 */
declare interface Flex {
  /**
   * the version number
   */
  readonly version: string;

  /**
   *  the {@link Meter} instance
   */
  readonly meter: Flex.Meter;

  /**
   * the {@link Vendor} instance
   */
  readonly vendor: Flex.Vendor;
}

declare namespace Flex {
  /**
   * The main interface to access Meter.
   */
  interface Meter {
    /**
     * The genesis block of connected network. It's consistent in Flex' life-cycle.
     */
    readonly genesis: Meter.Block;

    /**
     * Returns current block-chain status.
     */
    readonly status: Meter.Status;

    /**
     * Return current candidate list
     */
    candidates(): Promise<Meter.Candidate[]>;

    /**
     * Return current bucket list
     */
    buckets(): Promise<Meter.Bucket[]>;

    /**
     * Return current stakeholder list
     */
    stakeholders(): Promise<Meter.Stakeholder[]>;

    /**
     * Return current auction information
     */
    auction(): Promise<Meter.Auction>;

    /**
     * Return summaries for past auctions
     */
    auctionSummaries(): Promise<Meter.AuctionSummary[]>;
    /**
     * Create a ticker to track head block changes.
     *
     * @returns ticker object
     */
    ticker(): Meter.Ticker;

    /**
     * Create an account visitor.
     *
     * @param addr account address
     */
    account(addr: string): Meter.AccountVisitor;

    /**
     * Create a block visitor.
     *
     * @param revision block id or number,
     * assumed to current value of status.head.id if omitted
     */
    block(revision?: string | number): Meter.BlockVisitor;

    /**
     * Create a transaction visitor.
     *
     * @param id tx id
     */
    transaction(id: string): Meter.TransactionVisitor;

    /**
     * Create a filter to filter logs (event | transfer).
     *
     * @type T
     * @param kind
     */
    filter<T extends 'event' | 'transfer'>(kind: T): Meter.Filter<T>;

    /**
     * Create an explainer to obtain how blockchain would execute a tx.
     */
    explain(): Meter.Explainer;
  }

  namespace Meter {
    type Bucket = {
      id: string;
      owner: string;
      value: string | number;
      token: number;
      createTime: string;
      unbounded: boolean;
      candidate: string;
      rate: number;
      option: number;
      bonusVotes: string | number;
      totalVotes: string | number;
    };

    type Delegate = {
      name: string;
      address: string;
      pubKey: string;
      votingPower: string | number;
      ipAddr: string;
      port: number;
    };

    type Candidate = {
      name: string;
      addr: string;
      pubKey: string;
      ipAddr: string;
      port: number;
      totalVotes: string | number;
      buckets: string[];
    };

    type Stakeholder = {
      holder: string;
      totalStake: string | number;
      buckets: string[];
    };

    type AuctionSummary = {
      auctionID: string;
      startHeight: number;
      endHeight: number;
      releasedMTRG: string;
      reservedPrice: string;
      createTime: number;
      receivedMTR: string;
      actualPrice: string;
      leftoverMTRG: string;
    };

    type AuctionTx = {
      addr: string;
      amount: string;
      count: number;
      nonce: number;
      lastTime: number;
    };

    type Auction = {
      auctionID: string;
      startHeight: number;
      endHeight: number;
      releasedMTRG: string;
      reservedPrice: string;
      createTime: number;
      receivedMTR: string;
      auctionTxs: AuctionTx[];
    };

    interface Ticker {
      /**
       * @returns a promise resolves right after head block changed
       * @remarks The returned promise never rejects.
       */
      next(): Promise<Status['head']>;
    }

    interface AccountVisitor {
      /**
       * the address of account to be visited
       */
      readonly address: string;

      /**
       * query the account
       *
       * @returns promise of account
       */
      get(): Promise<Account>;

      /**
       * query account code
       *
       * @returns promise of account code
       */
      getCode(): Promise<Code>;

      /**
       * query account storage
       *
       * @param key storage key
       * @returns promise of account storage
       */
      getStorage(key: string): Promise<Storage>;

      /**
       * Create a method object, to perform contract call, or build transaction clause.
       *
       * @param abi method's JSON ABI object
       * @returns method object
       */
      method(abi: object): Method;

      /**
       * Create an event visitor
       * @param abi event's JSON ABI object
       * @returns event visitor
       */
      event(abi: object): EventVisitor;
    }

    interface StakingVisitor {
      /**
       * query candidate list
       *
       * @returns promise of candiate list
       */
      getCandidates(): Promise<Candidate[]>;

      /**
       * query bucket list
       *
       * @returns promise of bucket list
       */
      getBuckets(): Promise<Bucket[]>;

      /**
       * query stakeholder list
       *
       * @returns promise of stakeholder list
       */
      getStakeholders(): Promise<Stakeholder[]>;
    }
    interface AuctionVisitor {
      /**
       * query auction
       *
       * @returns promise of auction
       */
      get(): Promise<Auction>;

      /**
       * query auction summary list
       *
       * @returns promise of auction summary list
       */
      getSummaries(): Promise<AuctionSummary[]>;
    }

    interface Method {
      /**
       * set value
       * @param val amount of VET to transfer
       */
      value(val: string | number): this;
      /**
       * set token
       * @param tkn token type
       */
      token(tkn: number): this;

      /**
       * set caller(msg.sender)
       * @param addr caller address
       */
      caller(addr: string): this;

      /**
       * set max allowed gas
       * @param gas
       */
      gas(gas: number): this;

      /**
       * set gas price
       * @param gp gas price in hex string
       */
      gasPrice(gp: string): this;

      /**
       * Pack arguments into {@link Clause}.
       * @param args method arguments
       */
      asClause(...args: any[]): Clause;

      /**
       * Call the method to obtain output without altering contract state.
       * @param args method arguments
       */
      call(...args: any[]): Promise<VMOutput>;

      /**
       * Turn on caching for result of method call
       * TODO: More detailed description
       * @param ties a set of addresses, as the condition of cache invalidation
       */
      cache(ties: string[]): this;
    }

    interface BucketVisitor {
      readonly id: string;
      get(): Promise<Bucket | null>;
    }
    interface CandidateVisitor {
      readonly address: string;
      get(): Promise<Candidate | null>;
    }
    interface DelegateVisitor {
      readonly address: string;
      get(): Promise<Delegate | null>;
    }

    interface StakeholderVisitor {
      readonly address: string;
      get(): Promise<Stakeholder | null>;
    }

    interface EventVisitor {
      /**
       * Pack indexed arguments into {@link Event.Criteria}.
       * @param indexed object contains indexed arguments
       */
      asCriteria(indexed: object): Event.Criteria;

      /**
       * Create an event filter
       * @param indexedSet a set of objects contain indexed arguments
       */
      filter(indexedSet: object[]): Filter<'event'>;
    }

    interface BlockVisitor {
      /**
       * id or number of the block to be visited
       */
      readonly revision: string | number;

      /**
       * query the block
       * @returns a promise of block.
       */
      get(): Promise<Block | null>;
    }

    interface TransactionVisitor {
      /**
       * id of transaction to be visited
       */
      readonly id: string;

      /**
       * query the transaction
       */
      get(): Promise<Transaction | null>;

      /**
       * query the receipt
       */
      getReceipt(): Promise<Receipt | null>;
    }

    interface Filter<T extends 'event' | 'transfer'> {
      /**
       * set criteria
       * @param set
       */
      criteria(set: Filter.Criteria<T>[]): this;

      /**
       * Set the range to filter in
       * @param range
       */
      range(range: Filter.Range): this;

      /**
       * Set sort order
       * @param order
       */
      order(order: 'asc' | 'desc'): this;

      /**
       * Apply the filter
       * @param offset
       * @param limit
       * @returns filtered records
       */
      apply(offset: number, limit: number): Promise<Meter.Filter.Result<T>>;
    }

    interface Explainer {
      /**
       * set caller
       * @param addr caller address
       */
      caller(addr: string): this;

      /**
       * set max allowed gas
       * @param gas
       */
      gas(gas: number): this;

      /**
       * set gas price
       * @param gp gas price in hex string
       */
      gasPrice(gp: string): this;

      /**
       * execute clauses
       * @param clauses
       */
      execute(clauses: Clause[]): Promise<VMOutput[]>;
    }

    /**
     * block chain status
     */
    type Status = {
      /**
       * progress of synchronization.
       * From 0 to 1, 1 means fully synchronized.
       */
      progress: number;

      /**
       * summary of head block
       */
      head: {
        /**
         * block id
         */
        id: string;

        /**
         * block number
         */
        number: number;

        /**
         * block timestamp
         */
        timestamp: number;

        /**
         * parent block id
         */
        parentID: string;
      };
    };

    type Account = {
      /**
       * account balance in hex string
       */
      balance: string;
      /**
       * account energy in hex string
       */
      energy: string;
      boundbalance: string;
      boundenergy: string;
      /**
       * true indicates contract account
       */
      hasCode: boolean;
    };

    type Storage = {
      value: string;
    };
    type Code = {
      code: string;
    };

    type CommitteeMember = {
      index: number;
      pubKey: string;
      netAddr: string;
    };

    type QuorumCert = {
      qcHeight: number;
      qcRound: number;
      voterBitArrayStr: string;
      epochID: number;
    };
    type Block = {
      id: string;
      number: number;
      size: number;
      parentID: string;
      timestamp: number;
      gasLimit: number;
      beneficiary: string;
      gasUsed: number;
      totalScore: number;
      txsRoot: string;
      stateRoot: string;
      receiptsRoot: string;
      signer: string;
      transactions: string[];
      isTrunk?: boolean;
      lastKBlockHeight: number;
      committee: CommitteeMember[];
      qc: QuorumCert;
      nonce: number;
    };

    type Clause = {
      to: string | null;
      value: string | number;
      token: number;
      data: string;
    };

    namespace Transaction {
      type Meta = {
        blockID: string;
        blockNumber: number;
        blockTimestamp: number;
      };
    }

    type Transaction = {
      id: string;
      chainTag: number;
      blockRef: string;
      expiration: number;
      clauses: Clause[];
      gasPriceCoef: number;
      gas: number;
      origin: string;
      nonce: string;
      dependsOn: string | null;
      size: number;
      meta: Transaction.Meta;
    };

    type Receipt = {
      gasUsed: number;
      gasPayer: string;
      paid: string;
      reward: string;
      reverted: boolean;
      outputs: {
        contractAddress: string | null;
        events: Event[];
        transfers: Transfer[];
      }[];
      meta: LogMeta;
    };

    type Event = {
      address: string;
      topics: string[];
      data: string;
      meta?: LogMeta;
      decoded?: object;
    };

    namespace Event {
      type Criteria = {
        address?: string;
        topic0?: string;
        topic1?: string;
        topic2?: string;
        topic3?: string;
        topic4?: string;
      };
    }

    type Transfer = {
      sender: string;
      recipient: string;
      amount: string;
      meta?: LogMeta;
    };

    namespace Transfer {
      type Criteria = {
        txOrigin?: string;
        sender?: string;
        recipient?: string;
      };
    }

    type LogMeta = {
      blockID: string;
      blockNumber: number;
      blockTimestamp: number;
      txID: string;
      txOrigin: string;
    };

    namespace Filter {
      type Criteria<T extends 'event' | 'transfer'> = T extends 'event'
        ? Event.Criteria
        : T extends 'transfer'
        ? Transfer.Criteria
        : never;

      type Range = {
        unit: 'block' | 'time';
        from: number;
        to: number;
      };
      type Result<T extends 'event' | 'transfer'> = Array<
        T extends 'event' ? Event : T extends 'transfer' ? Transfer : never
      >;
    }

    type VMOutput = {
      data: string;
      vmError: string;
      gasUsed: number;
      reverted: boolean;
      events: Event[];
      transfers: Transfer[];
      decoded?: object;
    };
  }

  interface Vendor {
    /**
     * Acquire the signing service
     * @param kind kind of target to be signed
     */
    sign<T extends 'tx' | 'cert'>(kind: T): Vendor.SigningService<T>;

    /**
     * Returns whether an address is owned by user
     * @param addr account address
     */
    owned(addr: string): Promise<boolean>;
  }

  namespace Vendor {
    interface TxSigningService {
      /**
       * enforce the signer
       * @param addr signer address
       */
      signer(addr: string): this;

      /**
       * enforce max allowed gas
       * @param gas
       */
      gas(gas: number): this;

      /**
       * set another txid as dependency
       * @param txid
       */
      dependsOn(txid: string): this;

      /**
       * set the link to reveal tx related information.
       * first appearance of slice '{txid}' in the given link url will be replaced with txid.
       * @param url link url
       */
      link(url: string): this;

      /**
       * set comment for the message
       * @param text
       */
      comment(text: string): this;

      /**
       * enable VIP-191 by providing delegation handler
       * @param handler to sign tx as fee delegator
       */
      delegate(handler: DelegationHandler): this;

      /**
       * send request
       * @param msg clauses with comments
       */
      request(msg: TxMessage): Promise<TxResponse>;
    }

    interface CertSigningService {
      /**
       * enforce the signer
       * @param addr signer address
       */
      signer(addr: string): this;

      /**
       * set the link to reveal cert related information.
       * first appearance of slice '{certid}' in the given link url will be replaced with cert id.
       * @param url link url
       */
      link(url: string): this;

      /**
       * send request
       * @param msg
       */
      request(msg: CertMessage): Promise<CertResponse>;
    }

    type SigningService<T extends 'tx' | 'cert'> = T extends 'tx'
      ? TxSigningService
      : T extends 'cert'
      ? CertSigningService
      : never;

    type TxMessage = Array<
      Meter.Clause & {
        /** comment to the clause */
        comment?: string;
        /** as the hint for wallet to decode clause data */
        abi?: object;
      }
    >;

    type CertMessage = {
      purpose: 'identification' | 'agreement';
      payload: {
        type: 'text';
        content: string;
      };
    };

    type TxResponse = {
      txid: string;
      signer: string;
    };

    type CertResponse = {
      annex: {
        domain: string;
        timestamp: number;
        signer: string;
      };
      signature: string;
    };

    /**
     * returns object contains signature of fee delegator
     * @param unsignedTx.raw RLP-encoded unsigned tx in hex form
     * @param unsignedTx.origin address of intended tx origin
     */
    type DelegationHandler = (unsignedTx: {
      raw: string;
      origin: string;
    }) => Promise<{ signature: string }>;
  }
  type ErrorType = 'BadParameter' | 'Rejected';

  interface Driver {
    readonly genesis: Meter.Block;
    /** current known head */
    readonly head: Meter.Status['head'];

    /**
     * poll new head
     * rejected only when driver closed
     */
    pollHead(): Promise<Meter.Status['head']>;

    getBlock(revision: string | number): Promise<Meter.Block | null>;
    getTransaction(id: string): Promise<Meter.Transaction | null>;
    getReceipt(id: string): Promise<Meter.Receipt | null>;

    getAccount(addr: string, revision: string): Promise<Meter.Account>;
    getCode(addr: string, revision: string): Promise<Meter.Code>;
    getStorage(addr: string, key: string, revision: string): Promise<Meter.Storage>;
    getCandidates(): Promise<Meter.Candidate[]>;
    getBuckets(): Promise<Meter.Bucket[]>;
    getStakeholders(): Promise<Meter.Stakeholder[]>;
    getAuction(): Promise<Meter.Auction>;
    getAuctionSummaries(): Promise<Meter.AuctionSummary[]>;

    explain(
      arg: Driver.ExplainArg,
      revision: string,
      cacheTies?: string[]
    ): Promise<Meter.VMOutput[]>;

    filterEventLogs(arg: Driver.FilterEventLogsArg): Promise<Meter.Event[]>;
    filterTransferLogs(arg: Driver.FilterTransferLogsArg): Promise<Meter.Transfer[]>;

    // vendor methods
    signTx(msg: Driver.SignTxArg, options: Driver.SignTxOption): Promise<Driver.SignTxResult>;
    signCert(
      msg: Driver.SignCertArg,
      option: Driver.SignCertOption
    ): Promise<Driver.SignCertResult>;
    isAddressOwned(addr: string): Promise<boolean>;
  }

  namespace Driver {
    type ExplainArg = {
      clauses: Array<{
        to: string | null;
        value: string;
        data: string;
      }>;
      caller?: string;
      gas?: number;
      gasPrice?: string;
    };

    type FilterEventLogsArg = {
      range: Meter.Filter.Range;
      options: {
        offset: number;
        limit: number;
      };
      criteriaSet: Meter.Event.Criteria[];
      order: 'asc' | 'desc';
    };

    type FilterTransferLogsArg = {
      range: Meter.Filter.Range;
      options: {
        offset: number;
        limit: number;
      };
      criteriaSet: Meter.Transfer.Criteria[];
      order: 'asc' | 'desc';
    };

    type SignTxArg = Array<{
      to: string | null;
      value: string;
      data: string;
      token: number;
      comment?: string;
      abi?: object;
    }>;
    type SignTxOption = {
      signer?: string;
      gas?: number;
      dependsOn?: string;
      link?: string;
      comment?: string;
      delegationHandler?: Vendor.DelegationHandler;
    };
    type SignTxResult = Vendor.TxResponse;

    type SignCertArg = Vendor.CertMessage;
    type SignCertOption = {
      signer?: string;
      link?: string;
    };
    type SignCertResult = Vendor.CertResponse;
  }
}

declare interface Window {
  readonly flex: Flex;
}

declare const flex: Flex;
