import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:webcontrol/widgets/rounded_button.dart';
import 'package:webcontrol/widgets/rounded_password_field.dart';
import 'package:webcontrol/widgets/rounded_text_field.dart';

import '../constants.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Scaffold(
      body: LoginScreenBackground(
        child: Container(
          padding: const EdgeInsets.fromLTRB(0, 50, 0, 0),
          child: ListView(
            children: [Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                    "Login",
                    style: TextStyle(fontWeight: FontWeight.bold)
                ),
                SvgPicture.asset(
                    "assets/svg/logo.svg",
                    color: kPrimaryMiddleColor,
                    height: size.height * 0.35
                ),
                RoundedTextField(
                  textInputType: TextInputType.text,
                  hintText: "Username",
                  icon: Icons.person,
                  onChanged: (value) {

                  },
                ),
                RoundedPasswordField(
                  hintText: "Password",
                  icon: Icons.lock, onChanged: (value) {

                },
                ),
                RoundedButton(
                  text: "Login",
                  press: () {

                  }, color: kPrimaryColor, textColor: Colors.white,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text("Don't have an account? ",
                        style: TextStyle(
                            color: kPrimaryColor
                        )),
                    GestureDetector(
                        onTap: () {

                        },
                        child: const Text("Register", style: TextStyle(
                          color: kPrimaryColor,
                          fontWeight: FontWeight.bold,
                        ),
                        ))
                  ],
                )
              ],
            ),],
          ),
        )
      ),
    );
  }
}

class LoginScreenBackground extends StatelessWidget {
  final Widget child;

  const LoginScreenBackground({Key? key, required this.child})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Container(
        width: double.infinity,
        height: size.height,
        child: Stack(
          alignment: Alignment.center,
          children: [
            Positioned(
              top: 0,
              left: 0,
              child: Image.asset("assets/images/main_top.png",
                  width: 150),
            ),
            Positioned(
              bottom: 0,
              right: 0,
              child: Image.asset(
                "assets/images/login_bottom.png",
                width: 150,
              ),
            ),
            child,
          ],
        ));
  }
}
