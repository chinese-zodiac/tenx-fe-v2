import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextFieldStyled from '../components/styled/TextFieldStyled';
import { useAccount, useNetwork } from 'wagmi';
import useTenXToken from '../hooks/useTenXToken';
import { Box, keyframes, Stack } from '@mui/system';
import SliderPercentagePicker from '../components/styled/SliderPercentagePicker';
import RadioFieldStyled from '../components/styled/RadioFieldStyled';
import Header from '../components/elements/Header';
import FooterArea from '../components/layouts/FooterArea';
import ButtonPrimary from '../components/styled/ButtonPrimary';
import { prepareWriteContract, writeContract } from '@wagmi/core'
import { waitForTransaction } from 'wagmi/actions'
import TenXTokenV2Abi from '../abi/TenXTokenV2.json'
import ChangeArea from '../components/elements/ChangeArea';
import { CircularProgress } from '@mui/material';
import { Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { gatewayTools, getIpfsUrl } from '../utils/getIpfsJson';
import Markdown from 'react-markdown';
import DOMPurify from 'dompurify';

const EditSettings = () => {
    const { index } = useParams();
    const { address } = useAccount();

    const navigate = useNavigate();
    const { chain } = useNetwork();
    useEffect(() => {
        if (!chain) {
            navigate('/');
        }
    }, [chain, navigate]);

    const details = useTenXToken(index);

    const [selectedValue, setSelectedValue] = useState('0');

    const [descriptionMarkdownCID, setDescriptionMarkdownCID] = useState(details.tenXToken.descriptionMarkdownCID);

    const [exemptee, setExemptee] = useState(address);
    const [exempt, setExempt] = useState('0');

    const [balanceMax, setBalanceMax] = useState(details.tenXToken.balanceMax);
    const [transactionSizeMax, setTransactionSizeMax] = useState(details.tenXToken.transactionSizeMax);

    const [taxReceiver, setTaxReceiver] = useState(details.tenXToken.taxReceiver);

    const [buyTax, setBuyTax] = useState(details.tenXToken.buyTax);
    const [buyBurn, setBuyBurn] = useState(details.tenXToken.buyBurn);
    const [buyLpFee, setBuyLpFee] = useState(details.tenXToken.buyLpFee);
    const [sellTax, setSellTax] = useState(details.tenXToken.sellTax);
    const [sellBurn, setSellBurn] = useState(details.tenXToken.sellBurn);
    const [sellLpFee, setSellLpFee] = useState(details.tenXToken.sellLpFee);

    const [tokenLogoCID, setTokenLogoCID] = useState(details.tenXToken.tokenLogoCID);
    console.log('https://' + getIpfsUrl('ipfs.io/ipfs/' + tokenLogoCID))
    const [loading, setLoading] = useState(null);

    const [completion, setCompletion] = useState(null);

    const [content, setContent] = useState('Loading...');
    useEffect(() => {
        const fetchFileContent = async (ipfsLink) => {
            try {
                ipfsLink = await getIpfsUrl('ipfs.io/ipfs/' + ipfsLink);
                const response = await fetch('https://' + ipfsLink);
                const text = await response.text();
                const sanitizedText = DOMPurify.sanitize(text);
                setContent(sanitizedText);
            } catch (error) {
                console.error('Error fetching file from IPFS:', error);
                setContent('No data found'); // Update state with error message
            }
        };
        if (selectedValue == '0') {
            fetchFileContent(descriptionMarkdownCID); // Call the async function
        }
    }, [descriptionMarkdownCID]);

    const onEdit = async () => {
        try {
            if (selectedValue == '0') {
                // console.log({ selectedValue, descriptionMarkdownCID });
                if (!gatewayTools.containsCID('ipfs.io/' + descriptionMarkdownCID).containsCid) {
                    toast.error('The CID does not point to a valid text file for description.');
                    return;
                }
                try {
                    const ipfsLink = await getIpfsUrl('ipfs.io/ipfs/' + descriptionMarkdownCID);
                    const response = await fetch('https://' + ipfsLink);
                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.startsWith('text/')) {
                        toast.error('The CID does not point to a valid text file for description.');
                        return;
                    }
                } catch (err) {
                    toast.error('Invalid IPFS CID for description.');
                    return;
                }

                const config = await prepareWriteContract({
                    address: details.tenXToken.tokenAddress,
                    abi: TenXTokenV2Abi,
                    functionName: 'MANAGER_setDescriptionMarkdownCID',
                    args: [descriptionMarkdownCID]
                })

                const { hash } = await writeContract(config);
                setLoading(true);
                const receipt = await waitForTransaction({ hash });
                setCompletion(receipt);
                setLoading(false);
            }
            else if (selectedValue == '1') {
                // console.log({ exemptee, exempt:exempt == 1 });

                if (!exemptee || !/^0x[a-fA-F0-9]{40}$/.test(exemptee.trim())) {
                    toast.error('Please enter a valid wallet address');
                    return;
                }

                const config = await prepareWriteContract({
                    address: details.tenXToken.tokenAddress,
                    abi: TenXTokenV2Abi,
                    functionName: 'MANAGER_setIsExempt',
                    args: [exemptee, exempt == 1],
                })

                const { hash } = await writeContract(config);
                setLoading(true);
                const receipt = await waitForTransaction({ hash });
                setCompletion(receipt);
                setLoading(false);
            }
            else if (selectedValue == '2') {
                // console.log({ selectedValue, balanceMax, transactionSizeMax, });

                const config = await prepareWriteContract({
                    address: details.tenXToken.tokenAddress,
                    abi: TenXTokenV2Abi,
                    functionName: 'MANAGER_setMaxes',
                    args: [balanceMax, transactionSizeMax],
                })

                const { hash } = await writeContract(config);
                setLoading(true);
                const receipt = await waitForTransaction({ hash });
                setCompletion(receipt);
                setLoading(false);
            }
            else if (selectedValue == '3') {
                // console.log({ selectedValue, taxReceiver });

                if (!taxReceiver || !/^0x[a-fA-F0-9]{40}$/.test(taxReceiver.trim())) {
                    toast.error('Please enter a valid wallet address');
                    return;
                }

                const config = await prepareWriteContract({
                    address: details.tenXToken.tokenAddress,
                    abi: TenXTokenV2Abi,
                    functionName: 'MANAGER_setTaxReceiver',
                    args: [taxReceiver],
                })

                const { hash } = await writeContract(config);
                setLoading(true);
                const receipt = await waitForTransaction({ hash });
                setCompletion(receipt);
                setLoading(false);
            }
            else if (selectedValue == '4') {
                // console.log({ selectedValue, buyTax, buyBurn, buyLpFee, sellTax, sellBurn, sellLpFee });

                const config = await prepareWriteContract({
                    address: details.tenXToken.tokenAddress,
                    abi: TenXTokenV2Abi,
                    functionName: 'MANAGER_setTaxes',
                    args: [buyTax, buyBurn, buyLpFee, sellTax, sellBurn, sellLpFee],
                })

                const { hash } = await writeContract(config);
                setLoading(true);
                const receipt = await waitForTransaction({ hash });
                setCompletion(receipt);
                setLoading(false);
            }
            else if (selectedValue == '5') {
                // console.log({ selectedValue, tokenLogoCID });
                if (!gatewayTools.containsCID('ipfs.io/' + tokenLogoCID).containsCid) {
                    toast.error('The CID does not point to a valid image for logo.');
                    return;
                }

                try {
                    const ipfsLink = await getIpfsUrl('ipfs.io/ipfs/' + tokenLogoCID);
                    console.log({ipfsLink})
                    const response = await fetch('https://' + ipfsLink);
                    const contentType = response.headers.get('content-type');

                    if (!contentType || !contentType.startsWith('image/')) {
                        toast.error('The CID does not point to a valid image for logo.');
                        return;
                    }
                } catch (err) {
                    toast.error('Invalid IPFS CID for image.');
                    return;
                }

                const config = await prepareWriteContract({
                    address: details.tenXToken.tokenAddress,
                    abi: TenXTokenV2Abi,
                    functionName: 'MANAGER_setTokenLogoCID',
                    args: [tokenLogoCID],
                })

                const { hash } = await writeContract(config);
                setLoading(true);
                const receipt = await waitForTransaction({ hash });
                setCompletion(receipt);
                setLoading(false);
            }
            else {
                console.log("Wrong Choice");
            }
        } catch (error) {
            console.error("Error in writing contract:", error);
        }
    }

    return (
        <Stack
            direction="column"
            minHeight="100vh"
        >
            <Header />
            <Stack id='selectbox'
                direction="column"
                flexGrow={1}
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                columnGap={2}
            >
                <RadioFieldStyled
                    selectedValue={selectedValue}
                    setSelectedValue={setSelectedValue}
                    title={'Select what to edit'}
                    labels={['Description CID', 'Fee Exemption', 'Maxes', 'Tax Reciever', 'Taxes', 'Logo CID']}
                    helpMsg={'Which detail is to be edited'}
                />
                <Stack id="editmainbox"
                    direction="row"
                    flexWrap="wrap"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    rowGap={2}
                >
                    {selectedValue == '0' && <>
                        <TextFieldStyled
                            text={descriptionMarkdownCID}
                            setText={setDescriptionMarkdownCID}
                            maxChar={70}
                            width="36em"
                            label="Product Description IPFS CID(IPFS CID)"
                            helpMsg="IPFS CID (hash) of the product’s description in CommonMark. Upload and pin the description .md file first, then copy the IPFS CID here. Acceps MD file in CommonMark format. Must be smaller than 10kb."
                        />
                        {descriptionMarkdownCID &&
                            <div className="descriptionbox">
                                <h2>Your description content:-</h2>
                                <Markdown>{content}</Markdown></div>
                        }
                    </>}
                    {selectedValue == '1' && <>
                        <TextFieldStyled
                            text={exemptee}
                            setText={setExemptee}
                            maxChar={42}
                            width="25em"
                            label="Exempt fee"
                            helpMsg="Account that is exempt from fees"
                        />
                        <RadioFieldStyled id="Exempted"
                            selectedValue={exempt}
                            setSelectedValue={setExempt}
                            title={'Exempted address'}
                            labels={['False', 'True']}
                            helpMsg={'Should the address be exempted or not. True for Yes and false for No'}
                        />
                    </>}
                    {selectedValue == '2' && <>
                        <TextFieldStyled
                            text={balanceMax}
                            setText={setBalanceMax}
                            maxChar={18}
                            width="11em"
                            label="Max Balance For Accounts"
                            helpMsg="Maximum balance for each account. Accounts cannot receive tokens that would cause them to go over this balance. Must be at least 0.01% of supply. Good for reducing some types of bots and snipers."
                        />
                        <TextFieldStyled
                            text={transactionSizeMax}
                            setText={setTransactionSizeMax}
                            maxChar={18}
                            width="11em"
                            label="Max Transaction Size"
                            helpMsg="Maximum transaction size. Buys and sells over this amount fail. Must be at least 0.01% of supply. Good for reducing some types of bots and snipers."
                        />
                    </>}
                    {selectedValue == '3' &&
                        <TextFieldStyled
                            text={taxReceiver}
                            setText={setTaxReceiver}
                            maxChar={42}
                            width="25em"
                            label="Fee Receiver"
                            helpMsg="Account that receives fees from Buy Fee and Sell Fee. Exempt from all fees and burns."
                        />
                    }
                    {selectedValue == '4' && <>
                        <SliderPercentagePicker
                            pct={buyTax}
                            setPct={setBuyTax}
                            label="Buy Fee"
                            helpMsg="Fee that will be sent to your account every time someone buys your product on cz.cash. Good for revenue. Maximum 9.00%"
                        />
                        <SliderPercentagePicker
                            pct={buyBurn}
                            setPct={setBuyBurn}
                            label="Buy Burn"
                            helpMsg="Portion of the product that will be destroyed every time someone buys on cz.cash. Good for scarcity. Maximum 9.00%"
                        />
                        <SliderPercentagePicker
                            pct={buyLpFee}
                            setPct={setBuyLpFee}
                            label="Buy LP Fee"
                            helpMsg="Percentage of each buy that will be added to liquidity. Good for increasing price stability and reducing slippage. May greatly increase trading gas costs."
                        />
                        <SliderPercentagePicker
                            pct={sellLpFee}
                            setPct={setSellLpFee}
                            label="Sell LP Fee"
                            helpMsg="Percentage of each sell that will be added to liquidity. Good for increasing price stability and reducing slippage. May greatly increase trading gas costs"
                        />
                        <SliderPercentagePicker
                            pct={sellTax}
                            setPct={setSellTax}
                            label="Sell Fee"
                            helpMsg="Fee that will be sent to your account every time someone sells your product on cz.cash. Good for revenue. Maximum 9.00%"
                        />
                        <SliderPercentagePicker
                            pct={sellBurn}
                            setPct={setSellBurn}
                            label="Sell Burn"
                            helpMsg="Portion of the product that will be destroyed every time someone sells on cz.cash. Good for scarcity. Maximum 9.00%"
                        />
                    </>}
                    {selectedValue === '5' && (
                        <>
                            <TextFieldStyled
                                text={tokenLogoCID}
                                setText={setTokenLogoCID}
                                maxChar={70}
                                width="36em"
                                label="Product Logo (IPFS CID)"
                                helpMsg="Shortened name for your new product. Up to 5 characters."
                            />
                            {tokenLogoCID && (
                                <Box
                                    as="img"
                                    src={`https://${getIpfsUrl(tokenLogoCID)}`}
                                    sx={{
                                        width: '3.5em',
                                        height: '3.5em',
                                        margin: 0,
                                        marginLeft: '0.5em',
                                        padding: 0,
                                        backgroundColor: 'white',
                                        border: 'solid 0.15em white',
                                        borderRadius: '5em',
                                        '&:hover': {
                                            border: 'solid 0.15em grey',
                                            backgroundColor: 'grey',
                                        },
                                    }}
                                    alt="Token Logo"
                                />
                            )}
                        </>
                    )}
                </Stack>
                <ButtonPrimary
                    onClick={onEdit}
                    sx={{
                        width: '9em',
                        marginTop: '0.66em',
                        fontSize: '1.5em',
                        position: 'relative',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        color: 'white',
                        borderRadius: '1.5em',
                        border: 'solid 5px #e16b31',
                        background:
                            'radial-gradient(circle, rgba(116,29,131,1) 0%, rgba(149,54,68,1) 75%, rgba(108,10,57,1) 100%);',
                        backgroundSize: '400% 400%',
                        transition: '250ms',
                        animation: `${keyframes`
                  0% {
                      background-position: 0% 0%;
                    }
                    25% {
                      background-position: 66% 33%;
                    }
                    50% {
                      background-position: 0% 100%;
                    }
                    75% {
                      background-position: 33% 66%;
                    }
                    100% {
                      background-position: 0% 0%;
                    }`} 15s infinite ease`,
                        '&:hover': {
                            animationDuration: '1500ms',
                            color: 'pink',
                        },
                        '&:hover > span': {
                            position: 'relative',
                            top: '0px',
                            left: '0px',
                            animation: `${keyframes`
                  0% {
                      top: 0px;
                      left: 0px;
                    }
                    25% {
                      top: -3px;
                      left: -2px;
                    }
                    50% {
                      top: -2px;
                      left: 2px;
                    }
                    75% {
                      top: -2px;
                      left: -2px;
                    }
                    100% {
                      top: 0px;
                      left: 0px;
                    }`} 50ms infinite ease`,
                        },
                    }}
                >
                    Apply Changes
                </ButtonPrimary>
            </Stack>
            {/* Show loading spinner if transaction is in progress */}
            {loading && (
                <Stack
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        minHeight: '200px', // Ensure the spinner section has height
                    }}
                >
                    <CircularProgress size={50} thickness={4} />
                    <Typography sx={{ marginTop: 2 }}>Processing transaction...</Typography>
                </Stack>
            )}
            <ToastContainer />
            {/* Show transaction details once completion is true */}
            {completion && <ChangeArea transactionHash={completion.transactionHash} status={completion.status} token={completion.to} index={index} chainId={chain.id} blockExplorer={chain?.blockExplorers?.default?.url} />}
            <FooterArea />
        </Stack>
    );
}

export default EditSettings;