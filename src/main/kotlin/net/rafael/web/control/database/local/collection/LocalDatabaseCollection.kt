package net.rafael.web.control.database.local.collection

import com.google.gson.JsonArray
import com.google.gson.JsonObject
import net.rafael.web.control.interfaces.IDatabaseCollection

//------------------------------
//
// This class was developed by Rafael K.
// On 1/22/2022 at 6:27 PM
// In the project WebControl
//
//------------------------------

class LocalDatabaseCollection(override val data: JsonArray, override val key: String) : IDatabaseCollection {

    fun getData(index: Int): JsonObject {
        return data.get(index).asJsonObject
    }

    fun addData(jsonObject: JsonObject) {
        data.add(jsonObject)
    }

    fun createData(key: String, keys: Array<String>, vararg objs: String) {
        val jsonObject: JsonObject = JsonObject()
        jsonObject.addProperty("key", key)

        val dataObject: JsonObject = JsonObject()
        for ((i, dataKey) in keys.withIndex()) {
            dataObject.addProperty(dataKey, objs[i])
        }
        jsonObject.add("element", dataObject)
        addData(jsonObject)
    }

}
