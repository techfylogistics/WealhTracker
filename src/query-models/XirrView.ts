/* =========================================================
   XIRR models
   ========================================================= */

  
  export interface ItemXIRR {
    itemId: number;
    value: number;
  }
  export interface XIRRbyScope {
    scopeType:string
    scopeId: number;
    xirr: number;
  }
  export interface XIRR {
    value: number;
  }
