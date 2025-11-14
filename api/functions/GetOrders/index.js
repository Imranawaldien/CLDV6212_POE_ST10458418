const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    try {
        const conn = process.env.StorageConnectionString;
        const client = TableClient.fromConnectionString(conn, "Orders");
        await client.createIfNotExists();
        const results = [];
        for await (const e of client.listEntities()) {
            results.push({
                PartitionKey: e.partitionKey,
                OrderId: e.rowKey,
                Items: e.Items,
                Status: e.Status,
                Created: e.Created
            });
        }
        return { status: 200, body: results };
    } catch (err) {
        context.log.error(err);
        return { status: 500, body: err.message };
    }
};
