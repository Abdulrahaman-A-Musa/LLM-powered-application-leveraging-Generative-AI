import React from 'react';
import { ActionId } from './constants';

export interface Action {
  id: ActionId;
  name: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  promptBuilder: (context: string) => string;
}
