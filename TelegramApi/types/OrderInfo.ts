import { ShippingAddress } from './ShippingAddress';

/**
* This object represents information about an order.
*/
export type OrderInfo = {
  
  
  
  /**
  * Optional. User name
  */
  name?: string,
  
  /**
  * Optional. User&#x27;s phone number
  */
  phone_number?: string,
  
  /**
  * Optional. User email
  */
  email?: string,
  
  /**
  * Optional. User shipping address
  */
  shipping_address?: ShippingAddress,
  
}