const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    try {
        const conn = process.env.StorageConnectionString;
        const client = TableClient.fromConnectionString(conn, "Products");
        await client.createIfNotExists();
        const products = [];
        for await (const entity of client.listEntities()) {
            products.push({
                RowKey: entity.rowKey,
                Name: entity.Name,
                Description: entity.Description,
                Price: entity.Price,
                Stock: entity.Stock
            });
        }
        return { status: 200, body: products };
    } catch (err) {
        context.log.error(err);
        return { status: 500, body: err.message };
    }
};
