
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useAxiosPrivate from '@/hooks/baseURL/useAxiosSecureBase';

const COLORS = {
  primary: '#173B72',
  primaryDark: '#102B52',
  accent: '#3478F6',
  background: '#F4F7FB',
  surface: '#FFFFFF',
  text: '#182230',
  muted: '#7B8798',
  border: '#E6EBF2',
  green: '#16845B',
  red: '#DC2626',
};

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type DashboardData = {
  allWorkOrders: number;
  allPendingApprovalJobs: number;
  shippedJobs: number;
};

type DashboardResponse = {
  success: boolean;
  data: DashboardData;
};

const activities: {
  title: string;
  description: string;
  time: string;
  icon: IconName;
  color: string;
  route: string;
}[] = [
  {
    title: 'Work Orders',
    description: 'Open work orders to review recent records.',
    time: 'Quick access',
    icon: 'document-text-outline',
    color: '#3478F6',
    route: '/work-orders',
  },
  {
    title: 'Style Requirements',
    description: 'Review style and job requirements.',
    time: 'Quick access',
    icon: 'shirt-outline',
    color: '#8B5CF6',
    route: '/style-requirements',
  },
  {
    title: 'MIS Reports',
    description: 'Open management information reports.',
    time: 'Quick access',
    icon: 'analytics-outline',
    color: '#16845B',
    route: '/mis',
  },
];

function SectionHeading({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function formatNumber(value: number) {
  return value.toLocaleString('en-US');
}

export default function DashboardScreen() {
  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();

  const [dashboard, setDashboard] = useState<DashboardData>({
    allWorkOrders: 0,
    allPendingApprovalJobs: 0,
    shippedJobs: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const response = await axiosPrivate.get<DashboardResponse>(
        '/api/mobile/mobile-dashboard'
      );

      if (!response.data?.success || !response.data.data) {
        throw new Error('Invalid dashboard response');
      }

      setDashboard(response.data.data);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
      setError('Dashboard data could not be loaded. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [axiosPrivate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const navigate = (route: string) => {
    router.push(route as never);
  };

  const stats: {
    label: string;
    value: string;
    detail: string;
    icon: IconName;
    color: string;
    background: string;
  }[] = [
    {
      label: 'Work Orders',
      value: formatNumber(dashboard.allWorkOrders),
      detail: 'Total orders',
      icon: 'clipboard-outline',
      color: '#3478F6',
      background: '#EAF1FF',
    },
    {
      label: 'Pending Approval',
      value: formatNumber(dashboard.allPendingApprovalJobs),
      detail: 'Awaiting review',
      icon: 'time-outline',
      color: '#C77B17',
      background: '#FFF4DF',
    },
    {
      label: 'Completed Jobs',
      value: formatNumber(dashboard.shippedJobs),
      detail: 'Reconciled records',
      icon: 'checkmark-circle-outline',
      color: '#16845B',
      background: '#E4F7EF',
    },
    {
      label: 'Active Factories',
      value: '—',
      detail: 'Registered factories',
      icon: 'business-outline',
      color: '#8B5CF6',
      background: '#F0EAFE',
    },
  ];

  return (
    <ScrollView
      style={styles.content}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchDashboard(true)}
          tintColor={COLORS.accent}
        />
      }
    >
      {/* Welcome */}
      <View style={styles.welcome}>
        <View style={styles.welcomeTop}>
          <View style={styles.welcomeBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.welcomeBadgeText}>SM ERP WORKSPACE</Text>
          </View>

          <Ionicons
            name="grid-outline"
            size={24}
            color="#FFFFFF"
          />
        </View>

        <Text style={styles.welcomeTitle}>Dashboard</Text>

        <Text style={styles.welcomeDescription}>
          Monitor your work orders, pending approvals and completed jobs
          from one place.
        </Text>

        <View style={styles.welcomeFooter}>
          <Ionicons
            name="shield-checkmark-outline"
            size={17}
            color="#D5E3FF"
          />
          <Text style={styles.welcomeFooterText}>
            Garment Internal Audit & Operations
          </Text>
        </View>
      </View>

      {/* Overview */}
      <SectionHeading title="Overview" />

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>
            Loading dashboard statistics...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorCard}>
          <Ionicons
            name="cloud-offline-outline"
            size={30}
            color={COLORS.red}
          />

          <Text style={styles.errorTitle}>Unable to load dashboard</Text>

          <Text style={styles.errorMessage}>{error}</Text>

          <Pressable
            style={styles.retryButton}
            onPress={() => fetchDashboard()}
          >
            <Ionicons name="refresh-outline" size={17} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: stat.background },
                ]}
              >
                <Ionicons
                  name={stat.icon}
                  size={21}
                  color={stat.color}
                />
              </View>

              <Text style={styles.statValue}>{stat.value}</Text>

              <Text style={styles.statLabel}>{stat.label}</Text>

              <Text style={styles.statDetail}>{stat.detail}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Quick Actions */}
      <SectionHeading title="Quick Actions" />

      <View style={styles.quickActions}>
        <Pressable
          style={styles.quickAction}
          onPress={() => navigate('/work-orders')}
        >
          <View
            style={[
              styles.quickIcon,
              { backgroundColor: '#EAF1FF' },
            ]}
          >
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={COLORS.accent}
            />
          </View>

          <Text style={styles.quickLabel}>Work Orders</Text>

          <Ionicons
            name="chevron-forward"
            size={16}
            color={COLORS.muted}
          />
        </Pressable>

        <Pressable
          style={styles.quickAction}
          onPress={() => navigate('/style-requirements')}
        >
          <View
            style={[
              styles.quickIcon,
              { backgroundColor: '#F0EAFE' },
            ]}
          >
            <Ionicons
              name="shirt-outline"
              size={24}
              color="#8B5CF6"
            />
          </View>

          <Text style={styles.quickLabel}>Style Requirements</Text>

          <Ionicons
            name="chevron-forward"
            size={16}
            color={COLORS.muted}
          />
        </Pressable>

        <Pressable
          style={[styles.quickAction, styles.lastQuickAction]}
          onPress={() => navigate('/mis')}
        >
          <View
            style={[
              styles.quickIcon,
              { backgroundColor: '#E4F7EF' },
            ]}
          >
            <Ionicons
              name="analytics-outline"
              size={24}
              color={COLORS.green}
            />
          </View>

          <Text style={styles.quickLabel}>View MIS Reports</Text>

          <Ionicons
            name="chevron-forward"
            size={16}
            color={COLORS.muted}
          />
        </Pressable>
      </View>

      {/* Workspace */}
      <SectionHeading title="Your Workspace" />

      <View style={styles.activityCard}>
        {activities.map((item, index) => (
          <Pressable
            key={item.title}
            onPress={() => navigate(item.route)}
            style={[
              styles.activityItem,
              index !== activities.length - 1 && styles.activityDivider,
            ]}
          >
            <View
              style={[
                styles.activityIcon,
                { backgroundColor: `${item.color}15` },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={item.color}
              />
            </View>

            <View style={styles.activityText}>
              <Text style={styles.activityTitle}>{item.title}</Text>

              <Text style={styles.activityDescription}>
                {item.description}
              </Text>

              <Text style={styles.activityTime}>{item.time}</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color={COLORS.muted}
            />
          </Pressable>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>SM ERP</Text>
        <Text style={styles.footerText}>
          Garment Internal Audit & Operations
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  contentContainer: {
    padding: 18,
    paddingBottom: 34,
  },

  welcome: {
    padding: 21,
    borderRadius: 22,
    backgroundColor: COLORS.primaryDark,
    marginBottom: 27,
  },

  welcomeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  welcomeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4DD5A0',
  },

  welcomeBadgeText: {
    color: '#D5E3FF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  welcomeTitle: {
    marginTop: 22,
    fontSize: 29,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  welcomeDescription: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 20,
    color: '#CAD7ED',
  },

  welcomeFooter: {
    marginTop: 21,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  welcomeFooterText: {
    fontSize: 12,
    color: '#D5E3FF',
    fontWeight: '600',
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
  },

  loadingContainer: {
    minHeight: 190,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 28,
    gap: 12,
  },

  loadingText: {
    fontSize: 12,
    color: COLORS.muted,
  },

  errorCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 28,
  },

  errorTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 12,
  },

  errorMessage: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
  },

  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 18,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },

  statCard: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '44%',
    minHeight: 154,
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  statValue: {
    fontSize: 25,
    fontWeight: '800',
    color: COLORS.text,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 5,
  },

  statDetail: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 5,
  },

  quickActions: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    marginBottom: 28,
  },

  quickAction: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F6',
  },

  lastQuickAction: {
    borderBottomWidth: 0,
  },

  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },

  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 15,
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 17,
  },

  activityDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F6',
  },

  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activityText: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },

  activityDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: COLORS.muted,
    marginTop: 4,
  },

  activityTime: {
    fontSize: 10,
    color: COLORS.accent,
    marginTop: 6,
    fontWeight: '600',
  },

  footer: {
    alignItems: 'center',
    marginTop: 28,
  },

  footerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },

  footerText: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 5,
  },
});