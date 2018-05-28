import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

import ArrowLeft              from 'mdi-svg/svg/arrow-left.svg';
import ArrowRight             from 'mdi-svg/svg/arrow-right.svg';
import Check                  from 'mdi-svg/svg/check.svg';
import ChevronDown            from 'mdi-svg/svg/chevron-down.svg';
import ChevronLeft            from 'mdi-svg/svg/chevron-left.svg';
import ChevronRight           from 'mdi-svg/svg/chevron-right.svg';
import ChevronUp              from 'mdi-svg/svg/chevron-up.svg';
import Close                  from 'mdi-svg/svg/close.svg';
import Crosshairs             from 'mdi-svg/svg/crosshairs-gps.svg';
import Delete                 from 'mdi-svg/svg/delete.svg';
import DotsVertical           from 'mdi-svg/svg/dots-vertical.svg';
import File                   from 'mdi-svg/svg/file.svg';
import Folder                 from 'mdi-svg/svg/folder.svg';
import KeyboardReturn         from 'mdi-svg/svg/keyboard-return.svg';
import Magnify                from 'mdi-svg/svg/magnify.svg';
import Redo                   from 'mdi-svg/svg/redo.svg';
import Undo                   from 'mdi-svg/svg/undo.svg';
import VolumeHigh             from 'mdi-svg/svg/volume-high.svg';
import VolumeOff              from 'mdi-svg/svg/volume-off.svg';

const sizeMap = {
  s: 18,
  m: 24,
  l: 38,
  xl: 48
};
const makeIcon = (Icon) => {
  const IconComponent = ({ size='m', color='black' }) => {
    const className = cx('icon', `icon--${color}`);

    return (
      <Icon className={className} width={sizeMap[size]} height={sizeMap[size]} />
    );
  };
  IconComponent.propTypes = {
    size:  PropTypes.oneOf(['s', 'm', 'l', 'xl']),
    color: PropTypes.oneOf(['black', 'blue'])
  };

  return IconComponent;
};

export const IconArrowLeft              = makeIcon(ArrowLeft);
export const IconArrowRight             = makeIcon(ArrowRight);
export const IconCheck                  = makeIcon(Check);
export const IconChevronDown            = makeIcon(ChevronDown);
export const IconChevronLeft            = makeIcon(ChevronLeft);
export const IconChevronRight           = makeIcon(ChevronRight);
export const IconChevronUp              = makeIcon(ChevronUp);
export const IconClose                  = makeIcon(Close);
export const IconCrosshairs             = makeIcon(Crosshairs);
export const IconDelete                 = makeIcon(Delete);
export const IconDotsVertical           = makeIcon(DotsVertical);
export const IconFile                   = makeIcon(File);
export const IconFolder                 = makeIcon(Folder);
export const IconKeyboardReturn         = makeIcon(KeyboardReturn);
export const IconMagnify                = makeIcon(Magnify);
export const IconRedo                   = makeIcon(Redo);
export const IconUndo                   = makeIcon(Undo);
export const IconVolumeHigh             = makeIcon(VolumeHigh);
export const IconVolumeOff              = makeIcon(VolumeOff);
