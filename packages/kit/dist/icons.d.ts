import * as react from 'react';
import { SVGProps } from 'react';

type IconProps = {
    size?: number;
} & Omit<SVGProps<SVGSVGElement>, "ref">;
declare const CheckIcon: (p: IconProps) => react.JSX.Element;
declare const CrossIcon: (p: IconProps) => react.JSX.Element;
declare const SpinnerIcon: (p: IconProps) => react.JSX.Element;
declare const QueuedIcon: (p: IconProps) => react.JSX.Element;
declare const ChevronIcon: (p: IconProps) => react.JSX.Element;
declare const AlertIcon: (p: IconProps) => react.JSX.Element;
declare const UndoIcon: (p: IconProps) => react.JSX.Element;
declare const SearchIcon: (p: IconProps) => react.JSX.Element;
declare const DatabaseIcon: (p: IconProps) => react.JSX.Element;
declare const LayersIcon: (p: IconProps) => react.JSX.Element;
declare const FileIcon: (p: IconProps) => react.JSX.Element;
declare const GlobeIcon: (p: IconProps) => react.JSX.Element;
declare const UserIcon: (p: IconProps) => react.JSX.Element;

export { AlertIcon, CheckIcon, ChevronIcon, CrossIcon, DatabaseIcon, FileIcon, GlobeIcon, LayersIcon, QueuedIcon, SearchIcon, SpinnerIcon, UndoIcon, UserIcon };
