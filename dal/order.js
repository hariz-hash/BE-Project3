const {Order, OrderItem, Status} = require("../models");

const addOrder = async(orderStuff) =>
{
    const order = new Order(orderStuff);
    await order.save();
    return order;
}
const addOrderItem = async function (orderItemDetails)
{
    const orderItems = new OrderItem(orderItemDetails);
    await orderItems.save()
    return orderItems;
}
async function retrieveAllOrders(){
    const allOrder = await Order.collection().orderBy('id','DESC').fetch
    ({
        required: false,
        withRelated:['user', 'status']
    })
    return allOrder;
}
async function retrieveStatus(){
    const retrieveStatus = await Status.fetchAll().map((each)=>
    {
        return [each.get('id'), each.get('order_status')]
    })
    return retrieveStatus;
}


module.exports =
{
    addOrder,
    addOrderItem,
    retrieveAllOrders,
    retrieveStatus
    
}