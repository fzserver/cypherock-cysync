import {
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  LangDisplay,
  Typography,
  Flex,
  ScrollContainer,
  Divider,
  CloseButton,
  JsonView,
} from '@cypherock/cysync-ui';
import React, { useMemo } from 'react';

import { CoinIcon } from '~/components';
import {
  WalletConnectCallRequestMethod,
  WalletConnectCallRequestMethodMap,
  useWalletConnect,
} from '~/context';
import { selectLanguage, useAppSelector } from '~/store';

import { Title } from './components';

import { useSignMessageDialog } from '../context';

const AccountDisplay: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { activeAccount, activeWallet } = useWalletConnect();
  if (!(activeAccount && activeWallet)) return null;
  return (
    <Container display="flex" direction="column" py={2} gap={16}>
      <Typography
        variant="h5"
        color="muted"
        $fontWeight="medium"
        $textAlign="center"
      >
        <LangDisplay text={lang.strings.signMessage.subTitle} />
      </Typography>
      <Flex gap={12} align="center">
        <Typography variant="span" $fontWeight="medium">
          <LangDisplay text={activeWallet.name} />
        </Typography>
        <Typography variant="span" $fontWeight="medium">
          /
        </Typography>
        <Flex gap={8} align="center">
          <CoinIcon parentAssetId={activeAccount.parentAssetId} size={16} />
          <Typography variant="span" $fontWeight="medium">
            <LangDisplay text={activeAccount.name} />
          </Typography>
        </Flex>
      </Flex>
    </Container>
  );
};

const TYPED_DATA_SIGN: WalletConnectCallRequestMethod[] = [
  WalletConnectCallRequestMethodMap.SIGN_TYPED,
  WalletConnectCallRequestMethodMap.SIGN_TYPED_V4,
];
const MessageDisplay: React.FC = () => {
  const { callRequestData } = useWalletConnect();
  if (!callRequestData) return null;
  const message = useMemo(() => {
    if (
      callRequestData.method === WalletConnectCallRequestMethodMap.SIGN_PERSONAL
    )
      return window.Buffer.from(
        callRequestData.params[0].slice(2),
        'hex',
      ).toString();

    return callRequestData.params[1];
  }, [callRequestData]);

  if (TYPED_DATA_SIGN.includes(callRequestData.method))
    return (
      <ScrollContainer
        $bgColor="container"
        p={2}
        $maxHeight="calc(80vh - 400px)"
      >
        <Typography variant="span" color="muted" $fontSize={13}>
          <JsonView src={JSON.parse(message)} iconStyle="triangle" />
        </Typography>
      </ScrollContainer>
    );

  return (
    <ScrollContainer $bgColor="container" p={2} $maxHeight="calc(80vh - 400px)">
      <Typography color="muted" $fontSize={13} $whiteSpace="pre-wrap">
        {message}
      </Typography>
    </ScrollContainer>
  );
};

export const ViewMessageDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { buttons } = lang.strings;
  const { onNext, onClose } = useSignMessageDialog();

  return (
    <DialogBox width={500} $maxHeight="90vh" align="stretch" gap={0}>
      <Flex direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton onClick={onClose} />
      </Flex>
      <Divider variant="horizontal" />
      <DialogBoxBody pt={0} pr={0} pb={0} pl={0} gap={0}>
        <Title />
        <Container
          display="flex"
          direction="column"
          gap={24}
          pt={2}
          pb={4}
          px={5}
        >
          <AccountDisplay />
          <MessageDisplay />
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="secondary" onClick={onClose}>
          <LangDisplay text={buttons.reject} />
        </Button>
        <Button variant="primary" onClick={onNext}>
          <LangDisplay text={buttons.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
