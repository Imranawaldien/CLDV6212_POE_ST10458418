const { TableClient } = require("@azure/data-tables");
const { v4: uuidv4 } = require('uuid');

module.exports = async function (context, req) {
    try {
        const body = req.body || {};
        const user = body.user || "anonymous";
        const items = JSON.stringify(body.items || []);
        const conn = process.env.StorageConnectionString;
        const client = TableClient.fromConnectionString(conn, "Orders");
        await client.createIfNotExists();
        const id = uuidv4();
        const entity = { partitionKey: user, rowKey: id, Items: items, Status: "PENDING", Created: new Date().toISOString() };
        await client.createEntity(entity);
        return { status: 200, body: { message: "Order placed", orderId: id } };
    } catch (err) {
        context.log.error(err);
        return { status: 500, body: err.message };
    }
};
