import { lazy } from 'react'
import experienceMeta from './Experience/meta'
import minesweeperMeta from './Minesweeper/meta'
import skillsMeta from './Skills/meta'
import curriculumMeta from './Curriculum/meta'
import mailMeMeta from './MailMe/meta'

export const APP_REGISTRY = {
  experience: {
    ...experienceMeta,
    component: lazy(() => import('./Experience')),
  },
  minesweeper: {
    ...minesweeperMeta,
    component: lazy(() => import('./Minesweeper')),
  },
  skills: {
    ...skillsMeta,
    component: lazy(() => import('./Skills')),
  },
  curriculum: {
    ...curriculumMeta,
    component: lazy(() => import('./Curriculum')),
  },
  mailMe: {
    ...mailMeMeta,
    component: lazy(() => import('./MailMe')),
  },
  proyects: {
    title: 'Proyects',
    icon: '/icons/apps/folder.png',
    type: 'folder',
    defaultSize: { width: 500, height: 400 },
  },
  folder: {
    title: 'Folder',
    icon: '/icons/apps/folder.png',
    type: 'folder',
    defaultSize: { width: 500, height: 400 },
  },
}
