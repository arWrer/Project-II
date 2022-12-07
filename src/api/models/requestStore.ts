import { sequelize } from "./index"
import { DataTypes, NOW } from "sequelize";

const requestStore = sequelize.define("requestStore", {
    //매장 uuid
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    time: {
        type: DataTypes.DATE,
        defaultValue: NOW
    }
    
})

export default requestStore