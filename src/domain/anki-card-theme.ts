import { NoteBuilder } from '../builders/note-builder';
import { Card } from './card';

export interface AnkiCardTheme {
    getTemplate(deck: string, card: Card): NoteBuilder
  }