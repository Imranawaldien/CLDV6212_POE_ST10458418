const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

module.exports = async function (context, req) {
    try {
        const body = req.body || {};
        const email = body.email;
        const password = body.password;
        if(!email || !password) return { status: 400, body: "Missing email or password" };

        const conn = process.env.StorageConnectionString;
        const client = TableClient.fromConnectionString(conn, "Users");

        // PartitionKey USER, RowKey = email
        await client.createIfNotExists();
        const entity = { partitionKey: "USER", rowKey: email, Password: password };
        await client.upsertEntity(entity);
        return { status: 200, body: { message: "User added/validated", email } };
    } catch (err) {
        context.log.error(err);
        return { status: 500, body: err.message };
    }
};
