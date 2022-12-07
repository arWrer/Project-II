import { sequelize } from "./index"
import { DataTypes } from "sequelize";

import User from "./User"

const Payment = sequelize.define("Payment", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    toss_billing_key: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    card_company: {
        type: DataTypes.STRING,
    },
    card_type: {
        type: DataTypes.STRING,
    },
    card_number: {
        type: DataTypes.STRING,
    },
    card_owner_type: {
        type: DataTypes.STRING,
    }
})

export default Payment