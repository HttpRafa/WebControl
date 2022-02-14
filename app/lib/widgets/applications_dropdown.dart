import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class ApplicationsDropdown extends StatelessWidget {
  final List<String> applications;
  final String application;
  final Function(String?) onChanged;

  const ApplicationsDropdown(
      {Key? key,
      required this.applications,
      required this.application,
      required this.onChanged})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      height: 40,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(30),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          onChanged: onChanged,
          value: application,
          items: applications
              .map((e) => DropdownMenuItem(
                    child: Row(
                      children: [
                        const CircleAvatar(
                          radius: 12,
                          child: Icon(Icons.access_alarms_outlined),
                        ),
                        const SizedBox(width: 8),
                        Text(e,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            )),
                      ],
                    ),
                    value: e,
                  ))
              .toList(),
        ),
      ),
    );
  }
}
