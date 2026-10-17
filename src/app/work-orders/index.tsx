
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useAxiosPrivate from '@/hooks/baseURL/useAxiosSecureBase';
import PendingWorkOrderCard from '@/components/workOrders/PendingWorkOrders';
import UseAllUsers from '@/hooks/all-users/allUser';

type OrderType = 'knittingOrder' | 'dyeingOrder' | 'aopOrder';

type Composition = {
    composition?: string;
    workOrderQty?: number | string;
    unitePrice?: number | string;
};

type PendingWorkOrder = {
    id: string | number;
    jobNo?: string;
    workOrderNo?: string;
    lotNo?: string;
    factoryName?: string;
    stichLength?: string | number;
    machineDia?: string | number;
    yarnCount?: string | number;
    isRequested?: boolean;
    styleRequirement?: {
        buyerName?: string;
    };
    compositions?: Composition[];
};

type ConcernPerson = {
    id: string;
    name: string;
};

const ORDER_TYPES: { label: string; value: OrderType }[] = [
    { label: 'Knitting', value: 'knittingOrder' },
    { label: 'Dyeing', value: 'dyeingOrder' },
    { label: 'AOP', value: 'aopOrder' },
];

export default function NotApprovedWorkOrdersScreen() {
    const axiosPrivate = useAxiosPrivate();
    const router = useRouter();

    const [orderType, setOrderType] =
        useState<OrderType>('knittingOrder');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [orders, setOrders] = useState<PendingWorkOrder[]>([]);
    const [users, setUsers] = useState<ConcernPerson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const { allUsers } = UseAllUsers();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    const fetchOrders = useCallback(async () => {
        setError('');

        try {
            const response = await axiosPrivate.get(
                `/api/pending/work-order/${orderType}`,
                {
                    params: debouncedSearch
                        ? { search: debouncedSearch }
                        : {},
                }
            );

            setOrders(
                Array.isArray(response.data) ? response.data : []
            );
        } catch (err) {
            console.error('Failed to fetch pending work orders:', err);
            setError('Could not load work orders. Please try again.');
            setOrders([]);
        }
    }, [axiosPrivate, orderType, debouncedSearch]);

    useEffect(() => {
        let active = true;

        const load = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await axiosPrivate.get(
                    `/api/pending/work-order/${orderType}`,
                    {
                        params: debouncedSearch
                            ? { search: debouncedSearch }
                            : {},
                    }
                );

                if (active) {
                    setOrders(
                        Array.isArray(response.data) ? response.data : []
                    );

                }
            } catch (err) {
                console.error(err);

                if (active) {
                    setError('Could not load work orders. Please try again.');
                    setOrders([]);
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        void load();

        return () => {
            active = false;
        };
    }, [axiosPrivate, orderType, debouncedSearch]);





    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchOrders();
        } finally {
            setRefreshing(false);
        }
    }, [fetchOrders]);

    const handleRequestSent = (workOrderId: string | number) => {
        setOrders(current =>
            current.map(order =>
                String(order.id) === String(workOrderId)
                    ? { ...order, isRequested: true }
                    : order
            )
        );
    };

    return (
        <View style={styles.screen}>
            <View style={styles.pageHeading}>
                <View>
                    <Text style={styles.pageTitle}>Pending Approval</Text>
                    <Text style={styles.pageSubtitle}>
                        Review work orders and request approval
                    </Text>
                </View>

                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{orders.length}</Text>
                </View>
            </View>

            <View style={styles.tabs}>
                {ORDER_TYPES.map(item => {
                    const selected = orderType === item.value;

                    return (
                        <Pressable
                            key={item.value}
                            onPress={() => setOrderType(item.value)}
                            style={[
                                styles.tab,
                                selected && styles.activeTab,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selected && styles.activeTabText,
                                ]}
                            >
                                {item.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <View style={styles.searchBox}>
                <Ionicons
                    name="search-outline"
                    size={20}
                    color="#7B8798"
                />

                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search buyer, job, lot or yarn count"
                    placeholderTextColor="#98A2B3"
                    style={styles.searchInput}
                    returnKeyType="search"
                    autoCapitalize="none"
                />

                {search.length > 0 && (
                    <Pressable onPress={() => setSearch('')}>
                        <Ionicons name="close-circle" size={20} color="#98A2B3" />
                    </Pressable>
                )}
            </View>

            {loading ? (
                <View style={styles.centerState}>
                    <ActivityIndicator size="large" color="#173B72" />
                    <Text style={styles.stateText}>Loading work orders…</Text>
                </View>
            ) : error ? (
                <View style={styles.centerState}>
                    <Ionicons
                        name="cloud-offline-outline"
                        size={38}
                        color="#D9485F"
                    />
                    <Text style={styles.errorText}>{error}</Text>
                    <Pressable
                        onPress={() => void onRefresh()}
                        style={styles.retryButton}
                    >
                        <Text style={styles.retryText}>Try again</Text>
                    </Pressable>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) => (
                        <PendingWorkOrderCard
                            item={item}
                        //   users={users}

                        //   onRequestSent={handleRequestSent}
                        />
                    )}
                    contentContainerStyle={
                        orders.length === 0
                            ? styles.emptyList
                            : styles.listContent
                    }
                    refreshing={refreshing}
                    onRefresh={() => void onRefresh()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.centerState}>
                            <Ionicons
                                name="file-tray-outline"
                                size={42}
                                color="#98A2B3"
                            />
                            <Text style={styles.emptyTitle}>
                                No pending work orders
                            </Text>
                            <Text style={styles.stateText}>
                                Try another order type or search term.
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F4F7FB',
        paddingHorizontal: 16,
        paddingTop: 18,
    },
    pageHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    pageTitle: {
        fontSize: 23,
        fontWeight: '800',
        color: '#182230',
    },
    pageSubtitle: {
        fontSize: 12,
        color: '#7B8798',
        marginTop: 5,
    },
    countBadge: {
        minWidth: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#E5EDFC',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    countText: {
        color: '#173B72',
        fontWeight: '800',
    },
    tabs: {
        flexDirection: 'row',
        padding: 4,
        backgroundColor: '#E9EEF6',
        borderRadius: 13,
        marginBottom: 14,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 11,
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: '#173B72',
    },
    tabText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#526174',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    searchBox: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E6EBF2',
        borderRadius: 13,
        paddingHorizontal: 13,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        fontSize: 13,
        color: '#182230',
        paddingVertical: 0,
    },
    listContent: {
        paddingBottom: 28,
    },
    emptyList: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    centerState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 10,
    },
    stateText: {
        fontSize: 13,
        color: '#7B8798',
        textAlign: 'center',
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#182230',
    },
    errorText: {
        color: '#D9485F',
        textAlign: 'center',
        fontSize: 13,
    },
    retryButton: {
        marginTop: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#173B72',
    },
    retryText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
});
