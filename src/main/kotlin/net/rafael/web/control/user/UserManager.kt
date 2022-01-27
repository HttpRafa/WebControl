package net.rafael.web.control.user

import net.rafael.web.control.interfaces.ISaveable
import com.google.gson.GsonBuilder
import com.google.gson.stream.JsonReader
import net.rafael.web.control.WebControl
import net.rafael.web.control.classes.MethodResult
import java.io.*
import java.util.*

//------------------------------
//
// This class was developed by Rafael K.
// On 1/25/2022 at 4:45 PM
// In the project WebControl
//
//------------------------------

class UserManager : ISaveable {

    private val users: MutableList<User> = mutableListOf()

    fun createUser(username: String, password: String): MethodResult<User> {
        return if(findUser(username).isEmpty) {
            val user = User(username, password, UUID.randomUUID(), mutableListOf())
            users.add(user)
            MethodResult<User>().of(user)
        } else {
            MethodResult<User>().empty()
        }
    }

    fun findUser(username: String): Optional<User> {
        return users.stream().filter { user -> user.username == username }.findAny()
    }

    override fun save() {
        try {
            if (!databaseFolder.exists()) databaseFolder.mkdirs()
            if (!usersFile.exists()) usersFile.createNewFile()

            val fileWriter = FileWriter(usersFile)
            fileWriter.write(gson.toJson(this))
            fileWriter.flush()
            fileWriter.close()
        } catch (exception: IOException) {
            WebControl.logger.handleException(exception)
        }
    }

    companion object {
        private val gson = GsonBuilder().serializeNulls().setPrettyPrinting().disableHtmlEscaping().create()
        private val databaseFolder = File("database/")
        private val usersFile = File("database/users.json")

        fun load(): UserManager {
            if (usersFile.exists()) {
                try {
                    return gson.fromJson(
                        JsonReader(InputStreamReader(FileInputStream(usersFile))),
                        UserManager::class.java
                    )
                } catch (exception: FileNotFoundException) {
                    WebControl.logger.handleException(exception)
                }
            }
            return UserManager()
        }
    }

}