/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-08-12 10:54:44
 * @LastEditTime: 2020-08-24 13:44:53
 * @LastEditors: kay
 */

export interface Id {
  id:                      string
  addresses:               Array<string>
  cluster_peers:           Array<string>
  cluster_peers_addresses: Array<string>
  version:                 string
  commit:                  string
  rpc_protocol_version:    string
  error:                   string
  icfs:                    ICFS
  peername:                string
}

export interface ICFS {
  id:        string
  addresses: Array<string>,
  error:     string
}

export interface Version {
  version: string
}

export interface Allocations {
  replication_factor_min: number
  replication_factor_max: number
  name:                   string
  mode:                   string
  shard_size:             number
  user_allocations:       string
  expire_at:              string
  metadata:               string
  pin_update:             string
  cid:                    {"/": string}
  type:                   number
  allocations:            Array<string>
  max_depth:              number
  reference:              string
}

export interface Pins {
  cid:      {"/": string}
  name:     string
  peer_map: any
}

export interface Health {
  cluster_id:           string
  id_to_peername:       any
  icfs_links:           any
  cluster_links:        any
  cluster_trust_links:  any
  cluster_to_icfs:      any
}

export interface Metrics {
  name:        string
  peers:       string
  value:       string
  expire:      number
  vaild:       Boolean
  received_at: number
}