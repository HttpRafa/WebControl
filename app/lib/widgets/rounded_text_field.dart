import 'package:flutter/material.dart';
import 'package:webcontrol/constants.dart';
import 'package:webcontrol/widgets/text_field_container.dart';

class RoundedTextField extends StatelessWidget {

  final String hintText;
  final IconData icon;
  final ValueChanged<String> onChanged;
  final TextInputType textInputType;

  const RoundedTextField({Key? key, required this.textInputType, required this.hintText, required this.icon, required this.onChanged}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextFieldContainer(
        child: TextField(
          onChanged: onChanged,
          keyboardType: textInputType,
          decoration: InputDecoration(
            icon: Icon(icon,
                color: kPrimaryColor),
            hintText: hintText,
            border: InputBorder.none,
          ),
        )
    );
  }

}