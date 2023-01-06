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
module.exports =
{
    addOrder,
    addOrderItem
    
}