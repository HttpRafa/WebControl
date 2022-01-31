package net.rafael.web.control.network.document

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.JsonObject
import com.google.gson.stream.JsonReader
import com.google.gson.JsonParser
import com.google.gson.JsonElement
import java.io.*
import java.util.LinkedList
import kotlin.Throws
import java.lang.reflect.Type
import java.nio.charset.StandardCharsets

//------------------------------
//
// This class was developed by Rafael K.
// On 1/31/2022 at 10:33 AM
// In the project WebControl
//
//------------------------------

class Document {
    
    var data: JsonObject

    constructor() {
        data = JsonObject()
    }

    constructor(jsonObject: JsonObject) {
        data = jsonObject
    }

    constructor(src: String) {
        val jsonReader = JsonReader(StringReader(src))
        data = JsonParser.parseReader(jsonReader).asJsonObject
    }

    fun append(key: String, value: String): Document {
        data.addProperty(key, value)
        return this
    }

    fun append(key: String, value: Number): Document {
        data.addProperty(key, value)
        return this
    }

    fun append(key: String, value: Boolean): Document {
        data.addProperty(key, value)
        return this
    }

    fun append(key: String, value: JsonElement): Document {
        data.add(key, value)
        return this
    }

    fun append(key: String, value: Document): Document {
        data.add(key, value.data)
        return this
    }

    fun append(key: String, value: Any): Document {
        data.add(key, JsonParser.parseString(gson.toJson(value)))
        return this
    }

    fun getAsString(key: String): String {
        return data[key].asString
    }

    fun <T> getAsObject(key: String, to: Class<T>): T {
        return Gson().fromJson(data[key], to)
    }

    fun getList(key: String, to: Class<*>): List<Class<*>> {
        val list: MutableList<Class<*>> = LinkedList()
        for (element in data[key].asJsonArray) {
            list.add(Gson().fromJson(element, to as Type))
        }
        return list
    }

    fun getAsBoolean(key: String): Boolean {
        return data[key].asBoolean
    }

    fun getAsNumber(key: String): Number {
        return data[key].asNumber
    }

    fun getAsDocument(key: String): Document {
        return Document(data[key].asJsonObject)
    }

    operator fun get(key: String): JsonElement {
        return data[key]
    }

    fun delete(key: String) {
        data.remove(key)
    }

    fun has(key: String): Boolean {
        return data.has(key)
    }

    fun save(file: File) {
        try {
            OutputStreamWriter(FileOutputStream(file), StandardCharsets.UTF_8).use { writer ->
                if (!file.exists()) {
                    file.createNewFile()
                }
                writer.write(GsonBuilder().disableHtmlEscaping().serializeNulls().setPrettyPrinting().create().toJson(data))
                writer.flush()
            }
        } catch (exception: IOException) {
            exception.printStackTrace()
        }
    }

    override fun toString(): String {
        return gson.toJson(data)
    }

    companion object {
        @Throws(IOException::class)
        fun load(file: File): Document {
            val jsonReader = JsonReader(InputStreamReader(FileInputStream(file), StandardCharsets.UTF_8))
            return Document(JsonParser.parseReader(jsonReader).asJsonObject)
        }

        val gson: Gson = GsonBuilder().create()
    }
    
}