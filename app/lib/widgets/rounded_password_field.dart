import 'package:flutter/material.dart';
import 'package:webcontrol/constants.dart';
import 'package:webcontrol/widgets/text_field_container.dart';

class RoundedPasswordField extends StatelessWidget {

  final String hintText;
  final IconData icon;
  final ValueChanged<String> onChanged;

  const RoundedPasswordField({Key? key, required this.hintText, required this.icon, required this.onChanged}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextFieldContainer(
        child: TextField(
          obscureText: true,
          onChanged: onChanged,
          decoration: InputDecoration(
            hintText: hintText,
            icon: Icon(
              icon,
              color: kPrimaryColor,
            ),
            suffixIcon: Icon(Icons.visibility, color: kPrimaryColor),
            border: InputBorder.none,
          ),
        )
    );
  }

}