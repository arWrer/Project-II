import { sequelize } from "./index"
import { DataTypes } from "sequelize";

const Uin = sequelize.define("uin", {
    encrypted_uin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    }
}, {
    updatedAt: false,
})

export default Uin