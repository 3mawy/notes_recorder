import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type {
  ToastOptions,
  TypeOptions} from 'react-toastify';
import {
  Slide,
  toast as toastify
} from 'react-toastify';
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type Message = {
  icon?: ReactNode;
  title: string | ReactNode;
  description?: string | { [key: string]: string[] };
  action?: ReactNode;
  closeable?: boolean;
  path?: string;
};

const defaultConfig: ToastOptions = {
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  position: 'bottom-right',
  transition: Slide,
  closeButton: (
    <div>
      <IconButton size="small" color="inherit">
        <CloseIcon fontSize="small" />
      </IconButton>
    </div>
  ),
};

const renderMessage = (message: Message) => {
  const { title, description: desc, action, icon, path } = message;
  const ContentWrapper = ({ children }: { children: ReactNode }) => (
    <Box component={path ? Link : 'div'} to={path || ''} display="flex" alignItems="center" p={1}>
      {children}
    </Box>
  );

  return (
    <ContentWrapper>
      {icon && <Box mr={1} display="flex" alignItems="center">{icon}</Box>}
      <Box flex="1">
        <Typography variant="subtitle1" fontWeight="bold" color="textPrimary">
          {title}
        </Typography>
        {desc && (
          <Typography variant="body2" color="textSecondary">
            {typeof desc === 'string' ? desc : Object.values(desc).map((item, index) => <div key={index}>{item[0]}</div>)}
          </Typography>
        )}
        {action && <Box mt={1}>{action}</Box>}
      </Box>
    </ContentWrapper>
  );
};

const getToastIcon = (type: TypeOptions, icon?: ReactNode) => {
  if (icon) return icon;

  switch (type) {
    case 'warning':
      return <WarningIcon color="warning" fontSize="small" />;
    case 'success':
      return <CheckCircleIcon color="success" fontSize="small" />;
    case 'info':
      return <InfoIcon color="primary" fontSize="small" />;
    case 'error':
      return <ErrorIcon color="error" fontSize="small" />;
    default:
      return undefined;
  }
};

const _toast = (message: Message, config?: ToastOptions) => {
  const { type = 'info', className } = config || {};
  const icon = getToastIcon(type, message.icon);
  const configProps = {
    ...defaultConfig,
    ...config,
  };

  return toastify(renderMessage({ ...message, icon }), {
    ...configProps,
    closeOnClick: configProps.closeOnClick && !message.path,
    className,
  });
};

const genToast = (type: TypeOptions) => {
  return (message: Message, config?: ToastOptions) => {
    return _toast(message, { ...config, type });
  };
};

const toast = {
  info: genToast('info'),
  success: genToast('success'),
  warning: genToast('warning'),
  error: genToast('error'),
  dismiss: toastify.dismiss,
  update: toastify.update,
  message: renderMessage,
};

export default toast;
