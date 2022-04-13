interface Payment {
  reference: string
  amount: { currency : string , value : number}
  status: string
  paymentRef: string
  modificationRef: string
}
