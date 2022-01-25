package net.rafael.web.control.classes

import net.rafael.web.control.classes.MethodResult
import java.lang.SafeVarargs
import java.util.Arrays

//------------------------------
//
// This class was developed by Rafael K.
// On 1/25/2022 at 5:51 PM
// In the project WebControl
//
//------------------------------

class MethodResult<T> {

    private var t: MutableList<T>? = null

    fun of(t: T): MethodResult<T> {
        this.t!!.add(t)
        return this
    }

    @SafeVarargs
    fun of(vararg t: T): MethodResult<T> {
        this.t!!.addAll(listOf(*t))
        return this
    }

    fun empty(): MethodResult<T> {
        t = null
        return this
    }

    val isObjectEmpty: Boolean
        get() = t == null
    val isObjectPresent: Boolean
        get() = t != null
    val isEmpty: Boolean
        get() = t!!.size <= 0
    val isPresent: Boolean
        get() = t!!.size > 0

    fun get(): T {
        return t!![0]
    }

}