const { Order, OrderItem, Status } = require("../models");

const addOrder = async (orderStuff) => {
    const order = new Order(orderStuff);
    await order.save();
    return order;
}
const addOrderItem = async function (orderItemDetails) {
    const orderItems = new OrderItem(orderItemDetails);
    await orderItems.save()
    return orderItems;
}
async function retrieveAllOrders() {
    const allOrder = await Order.collection().orderBy('id', 'DESC').fetch
        ({
            required: false,
            withRelated: ['user', 'status']
        })
    return allOrder;
}

async function retrieveOrderById(orderId) {
    const order = await Order.where({
        id: orderId
    }).fetch({
        require: true,
        withRelated: [
            'user',
            'status'
        ]
    })
    return order;
}

async function retrieveStatus() {
    const retrieveStatus = await Status.fetchAll().map((each) => {
        return [each.get('id'), each.get('order_status')]
    })
    return retrieveStatus;
}

async function updateOrder(orderId, data)
{
 const order = await retrieveOrderById(orderId);
const {status}= data;
order.set('order_status_id', status)
await order.save()
return true

}


module.exports =
{
    addOrder,
    addOrderItem,
    retrieveAllOrders,
    retrieveStatus,
    retrieveOrderById,
    updateOrder

}