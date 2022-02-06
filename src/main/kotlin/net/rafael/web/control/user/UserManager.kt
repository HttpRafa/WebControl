package net.rafael.web.control.user

import kotlin.Throws
import com.google.gson.stream.JsonReader
import com.google.gson.GsonBuilder
import net.rafael.web.control.WebControl
import java.io.*

//------------------------------
//
// This class was developed by Rafael K.
// On 2/6/2022 at 9:51 AM
// In the project WebControl
//
//------------------------------

class UserManager {

    private var collection: UserCollection = UserCollection()

    fun add(user: User) {
        this.collection.users.add(user)
        WebControl.logger.info("User§8[§b${user.username}§8] §acreated§8.")
        saveUsers()
    }

    fun isUsernameFree(username: String): Boolean {
        for (user in this.collection.users) {
            if(user.username == username) {
                return false
            }
        }
        return true
    }

    fun passwordStrength(password: String): Int {

        //Total score of password
        var score = 0
        score += if (password.length < 8) return 0 else if (password.length >= 10) 2 else 1

        //If it contains one digit, add 2 to total score
        if (password.matches(Regex("(?=.*[0-9]).*"))) score += 2

        //If it contains one lower case letter, add 2 to total score
        if (password.matches(Regex("(?=.*[a-z]).*"))) score += 2

        //If it contains one upper case letter, add 2 to total score
        if (password.matches(Regex("(?=.*[A-Z]).*"))) score += 2

        //If it contains one special character, add 2 to total score
        if (password.matches(Regex("(?=.*[~!@#$%^&*()_-]).*"))) score += 2

        return score

    }

    @Throws(FileNotFoundException::class)
    fun loadUsers() {
        if (usersFile.exists()) {
            WebControl.logger.info("Loading Users...")
            collection = gson.fromJson(JsonReader(InputStreamReader(FileInputStream(usersFile))), UserCollection::class.java)
            for (user in collection.users) {
                WebControl.logger.info("Loading User§8[§b" + user.username + "§8/§3" + user.uuid + "§8]§7...")
            }
        }
    }

    @Throws(IOException::class)
    fun saveUsers() {
        if (!databaseFolder.exists()) {
            databaseFolder.mkdirs()
        }
        if (!usersFile.exists()) {
            usersFile.createNewFile()
        }
        val fileWriter = FileWriter(usersFile)
        fileWriter.write(gson.toJson(this.collection))
        fileWriter.flush()
        fileWriter.close()
    }

    companion object {
        private val gson = GsonBuilder().disableHtmlEscaping().setPrettyPrinting().serializeNulls().create()
        private val databaseFolder = File("database/")
        private val usersFile = File("database/users.json")
    }

}