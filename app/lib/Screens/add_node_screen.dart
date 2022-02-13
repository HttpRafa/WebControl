import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:webcontrol/widgets/rounded_button.dart';
import 'package:webcontrol/widgets/rounded_password_field.dart';
import 'package:webcontrol/widgets/rounded_text_field.dart';

import '../constants.dart';

class AddNodeScreen extends StatelessWidget {

  const AddNodeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Scaffold(
      body: AddNodeScreenBackground(
        child: Container(
          padding: const EdgeInsets.fromLTRB(0, 50, 0, 0),
          child: ListView(
            children: [Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                    "Add Node",
                    style: TextStyle(fontWeight: FontWeight.bold)
                ),
                SvgPicture.asset(
                    "assets/svg/logo.svg",
                    color: kPrimaryMiddleColor,
                    height: size.height * 0.35
                ),
                RoundedTextField(
                  textInputType: TextInputType.text,
                  hintText: "Host",
                  icon: Icons.alt_route,
                  onChanged: (value) {

                  },
                ),
                RoundedTextField(
                  textInputType: TextInputType.number,
                  hintText: "Port",
                  icon: Icons.polymer,
                  onChanged: (value) {

                  },
                ),
                RoundedButton(
                  text: "Connect",
                  press: () {
                  }, color: kPrimaryColor, textColor: Colors.white,
                ),
              ],
            ),],
          ),
        )
      ),
    );
  }
}

class AddNodeScreenBackground extends StatelessWidget {
  final Widget child;

  const AddNodeScreenBackground({Key? key, required this.child})
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
                  width: size.width * 0.35),
            ),
            Positioned(
              bottom: 0,
              right: 0,
              child: Image.asset(
                "assets/images/login_bottom.png",
                width: size.width * 0.3,
              ),
            ),
            child,
          ],
        ));
  }
}
