import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

const Dashboard = lazy(() => import('@dashboard-views'));
const Notifications = lazy(() => import('@suite-views/notifications'));
const Passwords = lazy(() => import('@passwords-views'));
const Portfolio = lazy(() => import('@portfolio-views'));
const ErrorPage = lazy(() => import('@suite-views/error'));

const Transactions = lazy(() => import('@wallet-views/transactions'));
const Receive = lazy(() => import('@wallet-views/receive'));
const Details = lazy(() => import('@wallet-views/details'));
const Send = lazy(() => import('@wallet-views/send'));
const SignVerify = lazy(() => import('@wallet-views/sign-verify'));

const CoinMarketBuy = lazy(() => import('@wallet-views/coinmarket/buy'));
const CoinMarketBuyDetail = lazy(() => import('@wallet-views/coinmarket/buy/detail'));
const CoinMarketBuyOffers = lazy(() => import('@wallet-views/coinmarket/buy/offers'));
const CoinMarketExchange = lazy(() => import('@wallet-views/coinmarket/exchange'));
const CoinMarketExchangeDetail = lazy(() => import('@wallet-views/coinmarket/exchange/detail'));
const CoinMarketExchangeOffers = lazy(() => import('@wallet-views/coinmarket/exchange/offers'));
const CoinMarketSpend = lazy(() => import('@wallet-views/coinmarket/spend'));
const CoinmarketRedirect = lazy(() => import('@wallet-views/coinmarket/redirect'));

const Settings = lazy(() => import('@settings-views'));
const SettingsCoins = lazy(() => import('@settings-views/coins'));
const SettingsDebug = lazy(() => import('@settings-views/debug'));
const SettingsDevice = lazy(() => import('@settings-views/device'));

const AppRouter = () => (
    <Suspense fallback={<p>Loading</p>}>
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
            <Route
                path="/accounts/coinmarket/exchange/detail"
                component={CoinMarketExchangeDetail}
            />
            <Route
                path="/accounts/coinmarket/exchange/offers"
                component={CoinMarketExchangeOffers}
            />
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
    </Suspense>
);

export default AppRouter;
