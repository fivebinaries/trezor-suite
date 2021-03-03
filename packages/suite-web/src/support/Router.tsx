import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from '@dashboard-views';
import Notifications from '@suite-views/notifications';
import Passwords from '@passwords-views';
import Portfolio from '@portfolio-views';
import ErrorPage from '@suite-views/error';

import Transactions from '@wallet-views/transactions';
import Receive from '@wallet-views/receive';
import Details from '@wallet-views/details';
import Send from '@wallet-views/send';
import SignVerify from '@wallet-views/sign-verify';

import CoinMarketBuy from '@wallet-views/coinmarket/buy';
import CoinMarketBuyDetail from '@wallet-views/coinmarket/buy/detail';
import CoinMarketBuyOffers from '@wallet-views/coinmarket/buy/offers';
import CoinMarketExchange from '@wallet-views/coinmarket/exchange';
import CoinMarketExchangeDetail from '@wallet-views/coinmarket/exchange/detail';
import CoinMarketExchangeOffers from '@wallet-views/coinmarket/exchange/offers';
import CoinMarketSpend from '@wallet-views/coinmarket/spend';
import CoinmarketRedirect from '@wallet-views/coinmarket/redirect';

import Settings from '@settings-views';
import SettingsCoins from '@settings-views/coins';
import SettingsDebug from '@settings-views/debug';
import SettingsDevice from '@settings-views/device';

const AppRouter = () => (
    <Switch>
        <Route exact path="/" component={Dashboard} />
        {/* Accounts */}
        <Route exact path="/accounts" component={Transactions} />
        <Route path="/accounts/details" component={Details} />
        <Route path="/accounts/receive" component={Receive} />
        <Route path="/accounts/send" component={Send} />
        <Route path="/accounts/sign-verify" component={SignVerify} />
        {/* Coinmarket */}
        <Route exact path="/accounts/coinmarket" component={CoinMarketBuy} />
        <Route exact path="/accounts/coinmarket/buy" component={CoinMarketBuy} />
        <Route path="/accounts/coinmarket/buy/detail" component={CoinMarketBuyDetail} />
        <Route path="/accounts/coinmarket/buy/offers" component={CoinMarketBuyOffers} />
        <Route exact path="/accounts/coinmarket/exchange" component={CoinMarketExchange} />
        <Route path="/accounts/coinmarket/exchange/detail" component={CoinMarketExchangeDetail} />
        <Route path="/accounts/coinmarket/exchange/offers" component={CoinMarketExchangeOffers} />
        <Route path="/accounts/coinmarket/spend" component={CoinMarketSpend} />
        {/* Coinmarket Redirect */}
        <Route path="/coinmarket-redirect" component={CoinmarketRedirect} />
        {/* Notifications */}
        <Route path="/notifications" component={Notifications} />
        {/* Passwords */}
        <Route path="/passwords" component={Passwords} />
        {/* Portfolio */}
        <Route path="/portfolio" component={Portfolio} />
        {/* Settings */}
        <Route exact path="/settings" component={Settings} />
        <Route path="/settings/coins" component={SettingsCoins} />
        <Route path="/settings/debug" component={SettingsDebug} />
        <Route path="/settings/device" component={SettingsDevice} />
        {/* Modals */}
        <Route path="/backup" />
        <Route path="/bridge" />
        <Route path="/firmware" />
        <Route path="/onboarding" />
        <Route path="/recovery" />
        <Route path="/version" />
        {/* 404 */}
        <Route path="*" component={ErrorPage} />
    </Switch>
);

export default AppRouter;
