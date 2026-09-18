import { Component, signal } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { NgClass } from '@angular/common';

@Component({
  imports: [Button, NgClass],
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
