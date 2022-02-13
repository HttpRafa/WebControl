import 'package:flutter/material.dart';
import 'package:webcontrol/constants.dart';

class CustomAppBar extends StatelessWidget with PreferredSizeWidget {

  const CustomAppBar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: kPrimaryColor,
      elevation: 0,
      leading: IconButton(
        icon: const Icon(Icons.menu),
        iconSize: 28,
        onPressed: () {

        },
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.alarm_on),
          iconSize: 28,
          onPressed: () {

          },
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

}