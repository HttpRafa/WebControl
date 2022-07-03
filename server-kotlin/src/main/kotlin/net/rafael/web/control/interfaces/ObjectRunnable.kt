package net.rafael.web.control.interfaces

//------------------------------
//
// This class was developed by Rafael K.
// On 1/26/2022 at 5:42 PM
// In the project WebControl
//
//------------------------------
interface ObjectRunnable<A, R> {

    fun run(t: A): R

}