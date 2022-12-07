import { sequelize } from "./index"
import { DataTypes, NOW } from "sequelize";
import Store from "./Store"
import Menus from "./Menu"

//store는 mufi측에서 id만 채워서 등록됨.
const BUsers = sequelize.define("bUser", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    //username
    username: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true,
        }
    },
    encrypted_password: {
        type: DataTypes.STRING(32),
        allowNull: true,
    },
    registeredAt: {
        type: DataTypes.DATE,
        defaultValue: NOW
    },
    auth:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
    }
})

BUsers.hasMany(Store, {
    foreignKey: "buser_id",
})

BUsers.hasMany(Menus, {
    foreignKey: "buser_id"
})

export default BUsers
