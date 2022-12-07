import { sequelize } from "./index"
import { DataTypes, NOW } from "sequelize";
import Menu from "./Menu"
import SIN from "./Sin";
import Order from "./Order";
//store는 mufi측에서 id만 채워서 등록됨.
const Store = sequelize.define("Store", {
    //매장 uuid
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    //매장 이름
    name: {
        type: DataTypes.STRING,
        unique: true
    },
    //매장 설명
    description: {
        type: DataTypes.TEXT,
    },
    //우편 번호
    zip_code: {
        type: DataTypes.STRING(10),
        unique: false
    },
    //상세 주소
    detail_address: {
        type: DataTypes.STRING,
    },
    buser_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: NOW
    },
    registered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
})

Store.hasMany(Menu, {
    foreignKey: {
        name: "store_id",
        allowNull: false,
    }
})

Store.hasOne(SIN, {
    foreignKey: {
        name: "store_id",
        allowNull: false,
    }
})

Store.hasMany(Order, {
    foreignKey: {
        name: "store_id",
        allowNull: false,
    }
})

export default Store
