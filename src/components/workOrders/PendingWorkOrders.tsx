import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';

export type Composition = {
  id: number;
  unitePrice: number;
  workOrderQty: number;
  color: string;
  composition: string;
};

export type PendingWorkOrder = {
  id: number;
  jobNo: string;
  workOrderNo: string;
  factoryName: string;
  isApproved: boolean;
  isRequested: boolean;
  lotNo: string;
  machineDia: string;
  stichLength: string;
  yarnCount: string;

  styleRequirement?: {
    buyerName?: string | null;
    processLoss?: number | null;
    styleNo?: string | null;
  } | null;

  compositions?: Composition[];
};

type PendingWorkOrderCardProps = {
  item: PendingWorkOrder;
  onRequestApproval?: (item: PendingWorkOrder) => void;
  onDownloadPdf?: (item: PendingWorkOrder) => void;
  isRequesting?: boolean;
  isDownloading?: boolean;
};

const PendingWorkOrderCard: React.FC<PendingWorkOrderCardProps> = ({
  item,
  onRequestApproval,
  onDownloadPdf,
  isRequesting = false,
  isDownloading = false,
}) => {
  // buyerName exists inside styleRequirement in the API response.
  const buyerName = item.styleRequirement?.buyerName?.trim() || 'Unknown Buyer';

  const styleNo = item.styleRequirement?.styleNo || '-';
  const processLoss = item.styleRequirement?.processLoss;

  const compositions = item.compositions ?? [];

  const formatValue = (value: string | number | null | undefined) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    return String(value);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.jobNo}>
            {formatValue(item.jobNo)}
          </Text>

          <Text style={styles.workOrderNo}>
            Work Order #{formatValue(item.workOrderNo)}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            item.isApproved
              ? styles.approvedBadge
              : styles.pendingBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.isApproved
                ? styles.approvedText
                : styles.pendingText,
            ]}
          >
            {item.isApproved ? 'Approved' : 'Pending'}
          </Text>
        </View>
      </View>

      {/* Buyer and style details */}
      <View style={styles.buyerSection}>
        <Text style={styles.buyerLabel}>BUYER</Text>
        <Text style={styles.buyerName}>{buyerName}</Text>

        <View style={styles.divider} />

        <View style={styles.twoColumnRow}>
          <View style={styles.column}>
            <Text style={styles.label}>Style No</Text>
            <Text style={styles.value}>{styleNo}</Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Factory</Text>
            <Text style={styles.value}>
              {formatValue(item.factoryName)}
            </Text>
          </View>
        </View>
      </View>

      {/* Work order details */}
      <View style={styles.detailsGrid}>
        <DetailItem label="Lot No" value={item.lotNo} />
        <DetailItem label="Machine Dia" value={item.machineDia} />
        <DetailItem label="Stitch Length" value={item.stichLength} />
        <DetailItem label="Yarn Count" value={item.yarnCount} />

        {processLoss !== undefined && processLoss !== null && (
          <DetailItem
            label="Process Loss"
            value={`${processLoss}%`}
          />
        )}
      </View>

      {/* Composition list */}
      <View style={styles.compositionSection}>
        <View style={styles.compositionHeader}>
          <Text style={styles.sectionTitle}>Compositions</Text>
          <Text style={styles.compositionCount}>
            {compositions.length} item
            {compositions.length === 1 ? '' : 's'}
          </Text>
        </View>

        {compositions.length === 0 ? (
          <Text style={styles.emptyText}>
            No compositions available.
          </Text>
        ) : (
          compositions.map((composition) => (
            <View
              key={composition.id}
              style={styles.compositionCard}
            >
              <View style={styles.compositionTopRow}>
                <Text style={styles.colorName}>
                  {formatValue(composition.color)}
                </Text>

                <Text style={styles.quantity}>
                  Qty: {formatValue(composition.workOrderQty)}
                </Text>
              </View>

              <Text style={styles.compositionDescription}>
                {formatValue(composition.composition)}
              </Text>

              <Text style={styles.unitPrice}>
                Unit Price: {formatValue(composition.unitePrice)}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Actions */}
      {(onRequestApproval || onDownloadPdf) && (
        <View style={styles.actions}>
          {onDownloadPdf && (
            <Pressable
              onPress={() => onDownloadPdf(item)}
              disabled={isDownloading}
              style={[
                styles.secondaryButton,
                isDownloading && styles.disabledButton,
              ]}
            >
              <Text style={styles.secondaryButtonText}>
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </Text>
            </Pressable>
          )}

          {onRequestApproval && !item.isApproved && (
            <Pressable
              onPress={() => onRequestApproval(item)}
              disabled={isRequesting || item.isRequested}
              style={[
                styles.primaryButton,
                (isRequesting || item.isRequested) &&
                  styles.disabledButton,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {isRequesting
                  ? 'Requesting...'
                  : item.isRequested
                    ? 'Requested'
                    : 'Request Approval'}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

type DetailItemProps = {
  label: string;
  value: string | number | null | undefined;
};

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>
      {value === null || value === undefined || value === ''
        ? '-'
        : String(value)}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },

  headerContent: {
    flex: 1,
  },

  jobNo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  workOrderNo: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  approvedBadge: {
    backgroundColor: '#DCFCE7',
  },

  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  approvedText: {
    color: '#166534',
  },

  pendingText: {
    color: '#92400E',
  },

  buyerSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },

  buyerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
  },

  buyerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D4ED8',
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },

  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
  },

  column: {
    flex: 1,
    minWidth: 0,
  },

  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
    marginBottom: 10,
  },

  detailItem: {
    width: '50%',
    paddingHorizontal: 5,
    paddingVertical: 8,
  },

  label: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },

  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },

  compositionSection: {
    marginTop: 4,
  },

  compositionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  compositionCount: {
    fontSize: 11,
    color: '#6B7280',
  },

  compositionCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 11,
    marginBottom: 8,
  },

  compositionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  colorName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },

  quantity: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },

  compositionDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#4B5563',
    marginTop: 7,
  },

  unitPrice: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 6,
  },

  emptyText: {
    fontSize: 12,
    color: '#6B7280',
    paddingVertical: 12,
  },

  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },

  primaryButton: {
    flex: 1,
    minWidth: 130,
    backgroundColor: '#2563EB',
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  secondaryButton: {
    flex: 1,
    minWidth: 110,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '700',
  },

  disabledButton: {
    opacity: 0.5,
  },
});

export default PendingWorkOrderCard;
