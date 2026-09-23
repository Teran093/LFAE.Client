import { Component, signal } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { NgClass } from '@angular/common';
import { Select } from '../../../shared/components/select/select';
import { SelectOption } from '../../../shared/components/select-option/select-option';

@Component({
  imports: [Button, NgClass, Select, SelectOption],
  selector: 'app-demo',
  styleUrl: './demo.css',
  templateUrl: './demo.html',
})
export class Demo {
  // Buttons demo properties
  protected disableButtons = signal<boolean>(false);
  protected outlineButtons = signal<boolean>(false);
  protected sizeButtons = signal<'small' | 'medium' | 'large'>('medium');
}
