import { sequelize } from "./index"
import { DataTypes, NOW, DataType } from 'sequelize';
import Store from "./BUser"

const Menu = sequelize.define("Menu", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    store_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
})

export default Menu